import { cartService } from '../services/cart.service'
import { kitsService } from '../services/kits.service'
import Button from '../structures/Button'

export default new Button('add-to-cart', async (interaction) => {
  const kit = kitsService.getKit(interaction.message.content)
  if (!kit) {
    return await interaction.reply({ content: 'Kit not found', ephemeral: true })
  }

  cartService.addToCart(interaction.user.id, kit)
  await interaction.reply({
    content: `Added ${kit.name} to cart with id ${interaction.user.id}`,
    ephemeral: true
  })
})
