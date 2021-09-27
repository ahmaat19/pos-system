import dynamicAPI from './dynamicAPI'

const url = '/api/admin/category'

export const getCategories = async () => await dynamicAPI('get', url, {})

export const addCategory = async (obj) => await dynamicAPI('post', url, obj)

export const updateCategory = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteCategory = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
