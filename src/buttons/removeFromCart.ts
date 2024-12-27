import { cartService } from '../services/cart.service'
import { kitsService } from '../services/kits.service'
import Button from '../structures/Button'

export default new Button('remove-from-cart', async (interaction) => {
  const kit = kitsService.getKit(interaction.message.content)
  if (!kit) {
    return await interaction.reply({ content: 'Кит не найден!', ephemeral: true })
  }

  const isRemoved = cartService.removeFromCart(interaction.user.id, kit)
  if (!isRemoved) {
    return await interaction.reply({
      content: 'Кит не был найден в корзине ' + interaction.user.id,
      ephemeral: true
    })
  }

  await interaction.reply({
    content: `Удален ${kit.name} из корзины ${interaction.user.id}`,
    ephemeral: true
  })
})
