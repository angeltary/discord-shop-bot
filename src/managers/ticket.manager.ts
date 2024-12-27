import { ChannelType, type TextChannel } from 'discord.js'
import { client } from '../index'
import { Ticket, TicketModel } from '../models/ticket.model'
import { extractId } from '../utils/discord.utils'
import { incrementCount } from './count.manager'

export let tickets: Ticket[] = []

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

  // Remove tickets from database that are not in the server
  for (const ticket of tickets) {
    const ticketChannel = ticketChannels.get(ticket.channelId)
    if (!ticketChannel) {
      await TicketModel.deleteOne({ channelId: ticket.channelId })
      tickets = tickets.filter(
        (ticketEntry) => ticketEntry.channelId !== ticket.channelId
      )
    }
  }

  // Add tickets to database that are not in the server
  for (const channel of ticketChannels.values()) {
    const ticketChannel = channel as TextChannel
    const ticket = tickets.find((ticket) => ticket.channelId === ticketChannel.id)
    if (!ticket) {
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
  if (!ticket) {
    console.log('Ticket not found in the database')
    return
  }

  await TicketModel.deleteOne({ channelId })
  tickets = tickets.filter((ticket) => ticket.channelId !== channelId)
}
