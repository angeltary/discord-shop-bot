import {
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel
} from 'discord.js'
import { SlashCommand } from '../structures/command/SlashCommand'
import { actionRow, removeReply } from '../utils/discord.utils'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('setup-ticket')
    .setDescription('Setups ticket system.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (interaction) => {
    await removeReply(interaction)

    const channel: TextChannel = interaction.channel as TextChannel
    const button = new ButtonBuilder()
      .setCustomId('create-ticket')
      .setLabel('Create Ticket')
      .setStyle(ButtonStyle.Primary)
    const row = actionRow(button)

    channel.send({ components: [row] })
  }
)
