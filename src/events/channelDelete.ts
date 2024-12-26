import { TextChannel } from 'discord.js'
import { removeTicket } from '../managers/ticket.manager'
import { Event } from '../structures/Event'

export default new Event('channelDelete', async (channel) => {
  const textChannel = channel as TextChannel

  if (textChannel.parentId !== process.env.TICKET_CATEGORY_ID) {
    return
  }

  await removeTicket(textChannel.id)
})
