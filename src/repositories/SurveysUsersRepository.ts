import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SuveyUser";

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<SurveyUser> {

}

export { SurveysUsersRepository };
