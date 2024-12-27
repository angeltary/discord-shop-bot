import { ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js'
import { cartService } from '../services/cart.service'
import Button from '../structures/Button'
import { getCartContent } from '../utils/cart.utils'
import { actionRow } from '../utils/discord.utils'

export default new Button('update-cart', async (interaction) => {
  const channel = interaction.channel as TextChannel
  const userId = interaction.user.id

  const messages = await channel.messages.fetch()
  const message = messages.first()
  if (message) {
    await message.edit({
      components: [
        actionRow(
          new ButtonBuilder()
            .setCustomId('close-ticket')
            .setLabel('Закрыть тикет')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false),
          new ButtonBuilder()
            .setCustomId('update-cart')
            .setLabel('Обновить корзину')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        )
      ]
    })
  }

  const content = cartService.isEmpty(userId)
    ? ' нет китов'
    : '\n' + getCartContent(interaction.user.id).join('\n')
  await interaction.message.edit({
    content: `Корзина:${content}`
  })

  await interaction.reply({
    content: 'Корзина была обновлена',
    ephemeral: true
  })

  if (message) {
    setTimeout(async () => {
      await message.edit({
        components: [
          actionRow(
            new ButtonBuilder()
              .setCustomId('close-ticket')
              .setLabel('Закрыть тикет')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(false),
            new ButtonBuilder()
              .setCustomId('update-cart')
              .setLabel('Обновить корзину')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(false)
          )
        ]
      })
    }, 15000)
  }
})
