import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'count' } })
export class Count {
  @prop({ required: true, type: Number })
  public count!: number
}

export const CountModel = getModelForClass(Count)
