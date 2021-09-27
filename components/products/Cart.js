import React from 'react'
import Image from 'next/image'
import Customer from '../products/Customer'
import { FaMoneyBillAlt, FaPlus, FaTimesCircle, FaUsers } from 'react-icons/fa'

const Cart = ({
  cartItems,
  setDiscount,
  discount,
  handleSubmit,
  submitHandler,
  errors,
  register,
  setCartItems,
}) => {
  const subTotal =
    cartItems &&
    cartItems.length > 0 &&
    cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)

  return (
    <div className='border border-top-0 border-end-0 border-bottom-0 border-light px-2'>
      <div className='d-flex justify-content-between'>
        <button
          className='btn btn-primary btn-sm'
          data-bs-toggle='modal'
          data-bs-target='#homeCustomerModal'
        >
          <FaUsers className='mb-1' /> Customers
        </button>
        <button className='btn btn-primary btn-sm'>
          <FaPlus className='mb-1' /> New
        </button>
      </div>
      <hr />

      <Customer />

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='card'>
          <ul className='list-group list-group-flush'>
            {cartItems &&
              cartItems.length > 0 &&
              cartItems.map((item) => (
                <li key={item._id} className='list-group-item'>
                  <div className='d-flex justify-content-between'>
                    <button
                      type='button'
                      className='btn position-relative bg-transparent shadow-sm py-0 px-1 rounded-3'
                    >
                      <Image
                        width='35'
                        height='35'
                        priority
                        src={item.image}
                        alt={item.image}
                        className='img-fluid rounded-pill my-auto '
                      />
                      <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill'>
                        x{item.qty}{' '}
                      </span>
                    </button>
                    <div className='text-center'>{item.item}</div>
                    <span className='text-primary fw-bold'>
                      ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            {subTotal && subTotal.length > 0 && (
              <>
                <li className='list-group-item'>
                  <div className='d-flex justify-content-between fw-bold'>
                    <span>Subtotal</span> <span> ${subTotal}</span>
                  </div>
                </li>
                <li className='list-group-item'>
                  <div className='mb-1'>
                    <input
                      type='number'
                      {...register('discount', {
                        maxLength: {
                          value: subTotal,
                          message: `Value must be less than or equal to ${subTotal}`,
                        },
                      })}
                      step='0.01'
                      max={subTotal}
                      onChange={(e) => setDiscount(e.target.value)}
                      value={discount}
                      placeholder='Discount'
                      className='form-control form-control-sm bg-light'
                    />
                    {errors && errors.discount && (
                      <span className='text-danger'>
                        {errors.discount.message}
                      </span>
                    )}
                  </div>
                </li>
              </>
            )}
          </ul>
          {subTotal && subTotal.length > 0 && (
            <>
              <div className='card-footer'>
                <div className='d-flex justify-content-between fw-bold'>
                  <span>Total</span>{' '}
                  <span> ${(subTotal - Number(discount)).toFixed(2)}</span>
                </div>
              </div>
              <button className='btn btn-primary form-control mt'>
                <FaMoneyBillAlt className='mb-1' /> PURCHASE
              </button>
              <button
                className='btn btn-outline-danger form-control mt-1'
                onClick={() => setCartItems([])}
              >
                <FaTimesCircle className='mb-1' /> CLEAN CART
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default Cart
