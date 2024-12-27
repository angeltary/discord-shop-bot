import {
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  ChannelType
} from 'discord.js'
import { client } from '../index'
import { count } from '../managers/count.manager'
import { addTicket, tickets } from '../managers/ticket.manager'
import { cartService } from '../services/cart.service'
import { kitsService } from '../services/kits.service'
import Button from '../structures/Button'
import { actionRow } from '../utils/discord.utils'

export default new Button('create-ticket', async (interaction) => {
  const categoryId = process.env.TICKET_CATEGORY_ID
  if (!categoryId) {
    throw Error('TICKET_CATEGORY_ID is not defined')
  }
  const userId = interaction.user.id

  const ticketEntry = tickets.find((ticket) => ticket.userId === userId)
  if (ticketEntry !== undefined) {
    return await interaction.reply({
      content: 'You already have a ticket opened!',
      ephemeral: true
    })
  }

  const cart = cartService.getCart(userId)
  if (!cart.length) {
    return await interaction.reply({
      content: 'Your cart is empty!',
      ephemeral: true
    })
  }

  const category = (await client.guild!.channels.fetch(
    categoryId
  )) as CategoryChannel

  const channel = await category.children.create({
    name: `ticket-${count!.count}`,
    type: ChannelType.GuildText,
    topic: `<@${userId}>`
  })
  await channel.permissionOverwrites.create(interaction.user, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true
  })

  interaction.reply({
    content: `Ticket created: ${channel.toString()}`,
    ephemeral: true
  })

  await addTicket({ userId, channelId: channel.id })

  const button = new ButtonBuilder()
    .setCustomId('close-ticket')
    .setLabel('Close Ticket')
    .setStyle(ButtonStyle.Danger)
  const row = actionRow(button)

  const counts = new Map<string, number>()
  for (const kit of cart) {
    counts.set(kit.id, (counts.get(kit.id) ?? 0) + 1)
  }

  const content = []
  for (const [id, count] of counts.entries()) {
    const kit = kitsService.getKitById(id)
    if (!kit) {
      continue
    }
    content.push(`${count}x ${kit.name} - ${kit.price} руб.`)
  }

  channel.send({
    content: `Your cart:\n${content.join('\n')}`,
    components: [row]
  })
})
