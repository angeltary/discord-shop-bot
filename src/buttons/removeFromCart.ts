import { cartService } from '../services/cart.service'
import { kitsService } from '../services/kits.service'
import Button from '../structures/Button'

export default new Button('remove-from-cart', async (interaction) => {
  const kit = kitsService.getKit(interaction.message.content)
  if (!kit) {
    return await interaction.reply({ content: 'Kit not found', ephemeral: true })
  }

  const isRemoved = cartService.removeFromCart(interaction.user.id, kit)
  if (!isRemoved) {
    return await interaction.reply({
      content: 'Kit not found in cart with id ' + interaction.user.id,
      ephemeral: true
    })
  }

  await interaction.reply({
    content: `Removed ${kit.name} to cart with id ${interaction.user.id}`,
    ephemeral: true
  })
})
