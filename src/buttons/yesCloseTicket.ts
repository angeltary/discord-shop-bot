import { TextChannel } from 'discord.js'
import { cartService } from '../services/cart.service'
import Button from '../structures/Button'

export default new Button('yes-close-ticket', async (interaction) => {
  const channel = interaction.channel as TextChannel

  const cart = cartService.getCart(interaction.user.id)
  if (cart.length) {
    cartService.deleteCart(interaction.user.id)
  }
  channel.delete()
})
