import { client } from '../index'
import { Event } from '../structures/Event'

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName)

    if (!command) {
      return await interaction.reply({
        content: 'Invalid command!',
        ephemeral: true
      })
    }

    await command.execute(interaction)
  } else if (interaction.isButton()) {
    const button = client.buttons.get(interaction.customId)
    if (!button) {
      return
    }

    await button.execute(interaction)
  }
})
