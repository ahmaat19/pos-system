import dynamicAPI from './dynamicAPI'

const url = '/api/admin/customer'

export const getCustomers = async () => await dynamicAPI('get', url, {})

export const addCustomer = async (obj) => await dynamicAPI('post', url, obj)

export const updateCustomer = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteCustomer = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
