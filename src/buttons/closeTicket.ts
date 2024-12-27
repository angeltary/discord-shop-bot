import { ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js'
import Button from '../structures/Button'
import { actionRow } from '../utils/discord.utils'

export default new Button('close-ticket', async (interaction) => {
  const channel = interaction.channel as TextChannel

  if (channel.parentId !== process.env.TICKET_CATEGORY_ID) {
    return await interaction.reply({
      content: 'Это не тикет!',
      ephemeral: true
    })
  }

  const yes = new ButtonBuilder()
    .setCustomId('yes-close-ticket')
    .setLabel('Yes')
    .setStyle(ButtonStyle.Danger)
  const no = new ButtonBuilder()
    .setCustomId('no-close-ticket')
    .setLabel('No')
    .setStyle(ButtonStyle.Secondary)
  const row = actionRow(yes, no)

  await interaction.message.edit({
    components: [
      actionRow(
        new ButtonBuilder()
          .setCustomId('close-ticket')
          .setLabel('Close Ticket')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      )
    ]
  })

  await interaction.reply({
    content: 'Вы уверены, что хотите закрыть тикет?',
    components: [row]
  })
})
