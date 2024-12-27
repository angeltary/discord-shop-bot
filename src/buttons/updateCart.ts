import { ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js'
import Button from '../structures/Button'
import { getCartContent } from '../utils/cart.utils'
import { actionRow } from '../utils/discord.utils'

export default new Button('update-cart', async (interaction) => {
  const channel = interaction.channel as TextChannel

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

  let content = getCartContent(interaction.user.id).join('\n')
  if (content === '') {
    content = ' нет китов'
  } else {
    content = '\n' + content
  }

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
