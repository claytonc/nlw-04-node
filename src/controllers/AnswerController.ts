import { Request, Response } from 'express';
import { getCustomRepository } from "typeorm";
import { AppError } from '../erros/AppErros';
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const survesUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await survesUsersRepository.findOne({
      id: String(u),
    })

    if (!surveyUser) {
      throw new AppError("Survey User does not exists!")
    }

    const surveyUserAsNotVoted = await survesUsersRepository.findOne({
      where: { id: String(u), value: null },
    })

    if (surveyUserAsNotVoted) {
      surveyUser.value = Number(value);
      await survesUsersRepository.save(surveyUser);
    }

    return response.json(surveyUser);
  }
}

export { AnswerController };

