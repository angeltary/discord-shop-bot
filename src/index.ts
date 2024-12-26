import { config } from 'dotenv'
import { Bot } from './structures/Client'

config()

export const client: Bot = new Bot()

client.init()
