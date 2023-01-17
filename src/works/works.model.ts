import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";


export interface WorksModel extends Base { }

export class WorksModel extends TimeStamps {
  @prop()
  title: string

  @prop()
  slug: string

  @prop()
  description: string

  @prop()
  poster: string

}