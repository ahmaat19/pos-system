import React from 'react'
import Image from 'next/image'
import { FaCartPlus, FaPlus, FaTrashAlt } from 'react-icons/fa'

const ProductList = ({
  products,
  activeCategory,
  cart,
  cartItems,
  removeFromCart,
}) => {
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
                product.category &&
                product.category._id === activeCategory && (
                  <tr key={product._id}>
                    <th>
                      {product.picture && (
                        <Image
                          width='35'
                          height='35'
                          priority
                          src={product.picture && product.picture.picturePath}
                          alt={product.picture && product.picture.pictureName}
                          className='img-fluid rounded-pill'
                        />
                      )}
                    </th>
                    <td>{product.name}</td>
                    <td>{product.unit}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      {product.stock > 0 && (
                        <>
                          <button
                            onClick={() => cart(product)}
                            className='btn btn-primary btn-sm rounded-pill me-1'
                          >
                            <FaPlus className='mb-1' />
                          </button>
                          {cartItems &&
                            cartItems.map(
                              (cart) =>
                                cart.product === product._id && (
                                  <button
                                    key={cart.product}
                                    onClick={() => removeFromCart(product)}
                                    className='btn btn-danger btn-sm rounded-pill '
                                  >
                                    <FaTrashAlt className='mb-1' />
                                  </button>
                                )
                            )}
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
