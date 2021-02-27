import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../erros/AppErros';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {

  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const userReporsitory = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const survesUsersRepository = getCustomRepository(SurveysUsersRepository);
    const user = await userReporsitory.findOne({ email })

    if (!user) {
      return response.status(400).json({
        error: "User does not exists!"
      });
    }

    const survey = await surveysRepository.findOne({ id: survey_id })

    if (!survey) {
      throw new AppError("Survey does not exists!")
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const surveyUserAlreadyExists = await survesUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ["user", "survey"]
    })

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL
    }

    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id
      await SendMailService.execute(email, survey.title, variables, npsPath)
      return response.json(surveyUserAlreadyExists)
    }

    const surveyUser = survesUsersRepository.create({
      user_id: user.id,
      survey_id
    })

    await survesUsersRepository.save(surveyUser);
    variables.id = surveyUser.id;

    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser)
  }
}

export { SendMailController };
