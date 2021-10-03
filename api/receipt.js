import dynamicAPI from './dynamicAPI'

const url = '/api/receipt'

export const searchCustomer = async (obj) =>
  await dynamicAPI('post', `${url}/customer`, obj)

export const receiptMoney = async (obj) => await dynamicAPI('post', url, obj)

// export const searchCustomersByItemDetails = async (obj) =>
//   await dynamicAPI('post', `${url}/customer-balance-details`, obj)
