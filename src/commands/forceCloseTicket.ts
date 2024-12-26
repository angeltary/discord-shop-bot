import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { SlashCommand } from '../structures/command/SlashCommand'
import { removeReply } from '../utils/discord.util'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('force-close')
    .setDescription('Closes ticket.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (interaction) => {
    const channel: TextChannel = interaction.channel as TextChannel

    if (channel.parentId !== process.env.TICKET_CATEGORY_ID) {
      return await interaction.reply({
        content: 'This is not a ticket channel!',
        ephemeral: true
      })
    }

    await removeReply(interaction)
    channel.delete()
  }
)