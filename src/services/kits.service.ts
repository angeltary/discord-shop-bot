import { readFileSync } from 'fs'
import { join } from 'path'
import { IKit } from '../types/kit.types'

class KitsService {
  private kits: IKit[]

  constructor() {
    this.kits = this.getAssortment()
  }

  private getAssortment() {
    const path = join(__dirname, '../assets/assortment.json')
    const file = readFileSync(path, 'utf-8')
    return JSON.parse(file)
  }

  public getKits() {
    return this.kits
  }

  public getKit(name: string) {
    return this.kits.find((kit) => name.includes(kit.name))
  }
}

export const kitsService = new KitsService()
