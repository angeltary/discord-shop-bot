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
import Button from '../structures/Button'
import { getCartContent } from '../utils/cart.utils'
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
      content: 'У тебя уже есть открытый тикет!',
      ephemeral: true
    })
  }

  if (cartService.isEmpty(userId)) {
    return await interaction.reply({
      content: 'Твоя корзина пустая!',
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
    content: `Тикет создан: ${channel.toString()}`,
    ephemeral: true
  })

  await addTicket({ userId, channelId: channel.id })

  const close = new ButtonBuilder()
    .setCustomId('close-ticket')
    .setLabel('Закрыть тикет')
    .setStyle(ButtonStyle.Danger)
  const update = new ButtonBuilder()
    .setCustomId('update-cart')
    .setLabel('Обновить корзину')
    .setStyle(ButtonStyle.Secondary)
  const row = actionRow(close, update)

  channel.send({
    content: `Корзина:\n${getCartContent(userId).join('\n')}`,
    components: [row]
  })
})
