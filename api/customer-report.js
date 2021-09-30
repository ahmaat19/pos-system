import dynamicAPI from './dynamicAPI'

const url = '/api/report/customer'

export const searchCustomersByItem = async () =>
  await dynamicAPI('get', `${url}/customer-balance`)

export const searchCustomersByItemDetails = async (obj) =>
  await dynamicAPI('post', `${url}/customer-balance-details`, obj)
