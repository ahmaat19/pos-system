import dynamicAPI from './dynamicAPI'

const url = '/api/admin/product'

export const getProducts = async () => await dynamicAPI('get', url, {})

export const addProduct = async (obj) => await dynamicAPI('post', url, obj)

export const updateProduct = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj.formData)

export const deleteProduct = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
