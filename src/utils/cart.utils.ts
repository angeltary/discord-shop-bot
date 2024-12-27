import { cartService } from '../services/cart.service'
import { kitsService } from '../services/kits.service'

export const getCartContent = (userId: string) => {
  const content = []

  const cart = cartService.getCart(userId)
  if (!cart.length) {
    return []
  }

  const counts = new Map<string, number>()
  for (const kit of cart) {
    counts.set(kit.id, (counts.get(kit.id) ?? 0) + 1)
  }

  for (const [id, count] of counts.entries()) {
    const kit = kitsService.getKitById(id)
    if (!kit) {
      continue
    }
    content.push(`${count}x ${kit.name} - ${kit.price * count} руб.`)
  }

  return content
}
