import { TextChannel } from 'discord.js'
import Button from '../structures/Button'

export default new Button('close-ticket', async (interaction) => {
  const channel = interaction.channel as TextChannel

  if (channel.parentId !== process.env.TICKET_CATEGORY_ID) {
    return await interaction.reply({
      content: 'This is not a ticket channel!',
      ephemeral: true
    })
  }

  channel.delete()
})
