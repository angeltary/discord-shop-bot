import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { SlashCommand } from '../structures/command/SlashCommand'
import { removeReply } from '../utils/discord.utils'

const getAssortment = () => {
  const path = join(__dirname, '../../assortment.json')
  const file = readFileSync(path, 'utf-8')
  return JSON.parse(file)
}

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

    const kits = getAssortment()
    for (const kit of kits) {
      const message = await channel.send(`${kit.name} - ${kit.price} руб.`)
      await message.react('🛒')
      await message.react('🧑‍💻')
    }
  }
)
