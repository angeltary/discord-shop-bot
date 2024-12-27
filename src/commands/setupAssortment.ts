import {
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel
} from 'discord.js'
import { kitsService } from '../services/kits.service'
import { SlashCommand } from '../structures/command/SlashCommand'
import { actionRow, removeReply } from '../utils/discord.utils'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('setup-assortment')
    .setDescription('Setups assortment channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (interaction) => {
    const channel: TextChannel = interaction.channel as TextChannel

    const id = process.env.ASSORTMENT_CHANNEL_ID
    if (!id) {
      throw Error('ASSORTMENT_CHANNEL_ID is not defined')
    }

    if (channel.id !== id) {
      return await interaction.reply({
        content: 'You are not in the assortment channel.',
        ephemeral: true
      })
    }
    await removeReply(interaction)

    for (const kit of kitsService.getKits()) {
      const add = new ButtonBuilder()
        .setCustomId('add-to-cart')
        .setLabel('Добавить')
        .setStyle(ButtonStyle.Success)
      const remove = new ButtonBuilder()
        .setCustomId('remove-from-cart')
        .setLabel('Удалить')
        .setStyle(ButtonStyle.Danger)
      const buttons = actionRow(add, remove)

      await channel.send({
        content: `${kit.name} - ${kit.price} руб.`,
        components: [buttons]
      })
    }
  }
)
