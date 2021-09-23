import React from 'react'
import Image from 'next/image'
import { FaCartPlus, FaMinus, FaPlus } from 'react-icons/fa'

const ProductList = ({ products, activeCategory, cart }) => {
  return (
    <div className='table-responsive'>
      <table className='table table-sm'>
        <thead>
          <tr className='bg-primary border-0 text-light text-center'>
            <td colSpan='6'>TOTAL PRODUCT ITEMS ({products.length})</td>
          </tr>
          <tr>
            <th scope='col'>PICTURE</th>
            <th scope='col'>ITEM</th>
            <th scope='col'>UNIT</th>
            <th scope='col'>PRICE</th>
            <th scope='col'>STOCK</th>
            <th scope='col'>
              <FaCartPlus className='mb-1 text-primary' />
            </th>
          </tr>
        </thead>
        <tbody>
          {products &&
            products.map(
              (product) =>
                product.category === activeCategory && (
                  <tr key={product._id}>
                    <th>
                      <Image
                        width='35'
                        height='35'
                        priority
                        src={product.image}
                        alt={product.image}
                        className='img-fluid rounded-pill'
                      />
                    </th>
                    <td>{product.item}</td>
                    <td>{product.unit}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      {product.stock > 0 && (
                        <>
                          {/* <button  onClick={() => cart(product)} className='btn btn-primary btn-sm rounded-pill me-1'>
                            <FaMinus className='mb-1' />
                          </button> */}
                          <button
                            onClick={() => cart(product)}
                            className='btn btn-primary btn-sm rounded-pill'
                          >
                            <FaPlus className='mb-1' />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
            )}
        </tbody>
      </table>
    </div>
  )
}

export default ProductList
