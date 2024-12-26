import { ChannelType, type TextChannel } from 'discord.js'
import { client } from '../index'
import { Ticket, TicketModel } from '../models/ticket.model'
import { extractId } from '../utils/discord.util'
import { incrementCount } from './count.manager'

export let tickets = new Array<Ticket>()

export const loadTickets = async () => {
  tickets = await TicketModel.find()

  const channels = await client.guild!.channels.fetch()
  const ticketChannels = channels.filter((channel) => {
    return (
      channel !== null &&
      channel.type === ChannelType.GuildText &&
      channel.parentId === process.env.TICKET_CATEGORY_ID
    )
  })

  // Remove tickets that are not in the database
  for (const ticket of tickets) {
    const ticketChannel = ticketChannels.get(ticket.channelId)
    if (ticketChannel === undefined) {
      await TicketModel.deleteOne({ channelId: ticket.channelId })
      tickets = tickets.filter(
        (ticketEntry) => ticketEntry.channelId !== ticket.channelId
      )
    }
  }

  // Add tickets that are not in the database
  for (const channel of ticketChannels.values()) {
    const ticketChannel = channel as TextChannel
    const ticket = tickets.find((ticket) => ticket.channelId === ticketChannel.id)
    if (ticket === undefined) {
      const ticket = new TicketModel({
        userId: extractId(ticketChannel.topic!),
        channelId: ticketChannel.id
      })
      await ticket.save()
      tickets.push(ticket)
    }
  }
}

export const addTicket = async (ticket: Ticket) => {
  console.log('Adding ticket:', ticket.channelId)

  await TicketModel.create(ticket)
  tickets.push(ticket)

  await incrementCount()
}

export const removeTicket = async (channelId: string) => {
  console.log('Removing ticket:', channelId)

  const ticket = tickets.find((ticket) => ticket.channelId === channelId)
  if (ticket === undefined) {
    console.log('Ticket not found in the database')
    return
  }

  await TicketModel.deleteOne({ channelId })
  tickets = tickets.filter((ticket) => ticket.channelId !== channelId)
}
