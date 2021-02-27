import { EntityRepository, Repository } from "typeorm";
import { Survey } from "../models/Suvey";

@EntityRepository(Survey)
class SurveysRepository extends Repository<Survey> {

}

export { SurveysRepository };
