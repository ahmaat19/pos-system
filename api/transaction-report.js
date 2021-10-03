import dynamicAPI from './dynamicAPI'

const url = '/api/transaction'

export const searchTransactions = async (obj) =>
  await dynamicAPI('post', url, obj)
