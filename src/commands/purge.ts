import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { SlashCommand } from '../structures/command/SlashCommand'
import { removeReply } from '../utils/discord.utils'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Clears all messages in the channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (interaction) => {
    await removeReply(interaction)

    const channel = interaction.channel as TextChannel

    await channel.bulkDelete(100)
  }
)
