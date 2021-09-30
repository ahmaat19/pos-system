import dynamicAPI from './dynamicAPI'

const url = '/api/report/sales'

export const searchSalesByItem = async (obj) =>
  await dynamicAPI('post', `${url}/sales-by-item-summary`, obj)

export const searchSalesByItemDetails = async (obj) =>
  await dynamicAPI('post', `${url}/sales-by-item-details`, obj)
