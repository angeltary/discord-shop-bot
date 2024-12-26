import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { loadTickets } from '../managers/ticket.manager'
import { TicketModel } from '../models/ticket.model'
import { SlashCommand } from '../structures/command/SlashCommand'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('sync-database')
    .setDescription('Synchronizes tickets with database.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (interaction) => {
    const before = await TicketModel.countDocuments()
    await loadTickets()
    const after = await TicketModel.countDocuments()

    await interaction.reply({
      content: 'Synchronization result: ' + before + ' → ' + after,
      ephemeral: true
    })
  }
)
