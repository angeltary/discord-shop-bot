import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ChatInputCommandInteraction
} from 'discord.js'

export const actionRow = <T extends AnyComponentBuilder>(
  ...builder: T[]
): ActionRowBuilder<T> => {
  return new ActionRowBuilder<T>().setComponents(builder)
}

export const removeReply = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply({ ephemeral: true })
  await interaction.deleteReply()
}

export const extractId = (mention: string) => {
  const match = mention.match(/<@(\d+)>/)
  return match !== null ? match[1] : ''
}
