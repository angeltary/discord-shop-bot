import { IKit } from '../types/kit.types'

class CartService {
  private carts: Map<string, IKit[]> = new Map()

  public addToCart(userId: string, kit: IKit) {
    const cart = this.carts.get(userId)
    if (cart) {
      cart.push(kit)
      console.log('Added to cart', cart)
    } else {
      this.carts.set(userId, [kit])
      console.log('Added to cart', this.carts)
    }
  }

  public removeFromCart(userId: string, kit: IKit): boolean {
    const cart = this.carts.get(userId)
    if (!cart) {
      return false
    }

    const index = cart.indexOf(kit)
    if (index === -1) {
      return false
    }

    cart.splice(index, 1)
    console.log('Removed from cart', cart)
    return true
  }

  public deleteCart(userId: string) {
    this.carts.delete(userId)
  }

  public isEmpty(userId: string): boolean {
    const cart = this.carts.get(userId)
    return !cart || cart.length === 0
  }

  public getCart(userId: string): IKit[] {
    return this.carts.get(userId) ?? []
  }
}

export const cartService = new CartService()
