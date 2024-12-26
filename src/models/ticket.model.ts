import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'tickets' } })
export class Ticket {
  @prop({ required: true, type: String })
  public userId!: string

  @prop({ required: true, type: String })
  public channelId!: string
}

export const TicketModel = getModelForClass(Ticket)
