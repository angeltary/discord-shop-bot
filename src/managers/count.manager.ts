import { Count, CountModel } from '../models/count.model'

export let count: Count | null

const createCount = async () => {
  count = await CountModel.create({ count: 1 })
}

export const loadCount = async () => {
  count = await CountModel.findOne()
  if (!count) {
    await createCount()
  }
}

export const incrementCount = async () => {
  count!.count++
  await CountModel.findOneAndUpdate({}, { count: count!.count })
}
