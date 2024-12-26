import { client } from '../index'
import { Event } from '../structures/Event'

export default new Event('ready', async () => {
  const commands = Array.from(client.commands.values()).map((c) => c.data)
  client.guild?.commands.set(commands)
})
