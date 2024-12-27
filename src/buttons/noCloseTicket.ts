import { ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js'
import Button from '../structures/Button'
import { actionRow } from '../utils/discord.utils'

export default new Button('no-close-ticket', async (interaction) => {
  const channel = interaction.channel as TextChannel

  await interaction.message.delete()

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
            .setDisabled(false)
        )
      ]
    })
  }
})
