import { ClientEvents, Collection } from 'discord.js'
import { globSync } from 'glob'
import { join, resolve } from 'path'
import Button from '../structures/Button'
import { Bot } from '../structures/Client'
import { Command } from '../structures/Command'
import { Event } from '../structures/Event'

const getFiles = (folder: string) => {
  const folderPath = resolve(__dirname, `../${folder}/`)
  return globSync(`*.{js,ts}`, { cwd: folderPath }).map((file) =>
    join(folderPath, file)
  )
}

const loadEvents = async (client: Bot) => {
  for (const file of getFiles('events')) {
    const event = require(file)
    const { event: eventName, execute }: Event<keyof ClientEvents> = event.default
    client.on(eventName, execute)
  }
}

const loadCommands = async (commands: Collection<string, Command>) => {
  for (const file of getFiles('commands')) {
    const command = require(file)
    const { data, execute } = command.default
    commands.set(data.name, { data, execute })
  }
}

const loadButtons = async (buttons: Collection<string, Button>) => {
  for (const file of getFiles('buttons')) {
    const command = require(file)
    const { customId, execute } = command.default
    buttons.set(customId, { customId, execute })
  }
}

export const load = async (client: Bot) => {
  await loadEvents(client)
  await loadCommands(client.commands)
  await loadButtons(client.buttons)
}
