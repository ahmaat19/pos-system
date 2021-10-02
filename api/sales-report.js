import dynamicAPI from './dynamicAPI'

const url = '/api/report/sales'

export const searchSalesByItem = async (obj) =>
  await dynamicAPI('post', `${url}/sales-by-item-summary`, obj)

export const searchSalesByItemDetails = async (obj) =>
  await dynamicAPI('post', `${url}/sales-by-item-details`, obj)

export const searchSalesBySeller = async (obj) =>
  await dynamicAPI('post', `${url}/${obj.seller}`, obj)

export const searchSalesBySellerDetails = async (obj) =>
  await dynamicAPI('post', `${url}/sales-by-seller-details`, obj)

export const searchSalesBySingleSeller = async (obj) =>
  await dynamicAPI('post', `${url}/sales-by-single-seller`, obj)

export const searchSalesBySellerSingleDetails = async (obj) =>
  await dynamicAPI('post', `${url}/sales-by-single-seller-details`, obj)
