import { Client, Collection, Guild } from 'discord.js'
import mongoose from 'mongoose'
import { loadCount } from '../managers/count.manager'
import { loadTickets } from '../managers/ticket.manager'
import { load } from '../utils/load.util'
import Button from './Button'
import { Command } from './Command'

export class Bot extends Client {
  public readonly commands = new Collection<string, Command>()
  public readonly buttons = new Collection<string, Button>()
  public guild: Guild | undefined

  constructor() {
    super({ intents: 32767 })
  }

  public async init(): Promise<void> {
    await this.initDiscord()
    await this.initDatabase()
  }

  private async initDiscord(): Promise<void> {
    try {
      await this.login(process.env.TOKEN)
      console.log(`Logged in as ${this.user!.tag}`)
    } catch (error) {
      console.error('Failed to login:', error)
    }

    const guildId = process.env.GUILD_ID
    if (guildId === undefined) {
      throw Error('GUILD_ID is not defined')
    }

    this.guild = await this.guilds.fetch(guildId)

    load(this)
  }

  private async initDatabase(): Promise<void> {
    const databaseUrl = process.env.DATABASE_URL
    if (databaseUrl === undefined) {
      throw Error('DATABASE_URL is not defined')
    }

    try {
      await mongoose.connect(databaseUrl, {
        dbName: 'discord'
      })
      console.log('Connected to database')
    } catch (error) {
      console.error('Failed to connect to database:', error)
    }

    await loadTickets()
    await loadCount()
  }
}
