import React from 'react'
import Image from 'next/image'
import Customer from '../products/Customer'
import { FaMoneyBillAlt, FaTimesCircle, FaUsers } from 'react-icons/fa'

const Cart = ({
  cartItems,
  watch,
  handleSubmit,
  submitHandler,
  errors,
  register,
  setCartItems,
  selectedCustomer,
  setSelectedCustomer,
  isLoadingAdd,
}) => {
  const subTotal =
    cartItems &&
    cartItems.length > 0 &&
    cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)

  return (
    <div className='border border-top-0 border-end-0 border-bottom-0 border-light px-2'>
      <div className='d-flex justify-content-end'>
        <button
          disabled={cartItems && cartItems.length === 0}
          className='btn btn-primary btn-sm'
          data-bs-toggle='modal'
          data-bs-target='#homeCustomerModal'
        >
          <FaUsers className='mb-1' /> Customers
        </button>
      </div>
      <hr />

      <Customer setSelectedCustomer={setSelectedCustomer} />

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='card'>
          <ul className='list-group list-group-flush'>
            <li className='list-group-item bg-primary text-light text-center'>
              {selectedCustomer
                ? selectedCustomer.name.toUpperCase()
                : 'Please select a customer'}
            </li>
            {cartItems &&
              cartItems.length > 0 &&
              cartItems.map((item) => (
                <li key={item.product} className='list-group-item mt-1'>
                  <div className='d-flex justify-content-between'>
                    <button
                      type='button'
                      className='btn position-relative bg-transparent shadow-sm py-0 px-1 rounded-3'
                    >
                      {item.picture && (
                        <Image
                          width='35'
                          height='35'
                          priority
                          src={item.picture && item.picture.picturePath}
                          alt={item.picture && item.picture.pictureName}
                          className='img-fluid rounded-pill my-auto '
                        />
                      )}
                      <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill'>
                        x{item.qty}{' '}
                      </span>
                    </button>
                    <div className='text-center'>{item.name}</div>
                    <span className='text-primary fw-bold'>
                      ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            {subTotal && subTotal.length > 0 && (
              <>
                <li className='list-group-item'>
                  <div className='fw-bold d-flex justify-content-between'>
                    <h6>Subtotal</h6> <h6> ${Number(subTotal)}</h6>
                  </div>
                  <div className='fw-bold d-flex justify-content-between'>
                    <h6>Discount</h6>{' '}
                    <h6> ${watch().discount ? watch().discount : 0}</h6>
                  </div>
                  <div className='d-flex justify-content-between fw-bold text-danger'>
                    <h6>Due</h6>{' '}
                    <h6>
                      $
                      {(
                        Number(subTotal) -
                        Number(watch().discount) -
                        Number(watch().paidAmount)
                      ).toFixed(2)}
                    </h6>
                  </div>
                </li>
                <li className='list-group-item'>
                  <div className='input-group'>
                    <input
                      type='number'
                      className='form-control bg-light'
                      placeholder={`discount (${subTotal})`}
                      step='0.01'
                      max={Number(subTotal)}
                      {...register('discount', { required: 'required!' })}
                      required
                    />
                    {errors && errors.discount && (
                      <span className='text-danger'>
                        {errors.discount.message}
                      </span>
                    )}
                    <input
                      type='number'
                      max={subTotal}
                      {...register('paidAmount', { required: 'required!' })}
                      className='form-control bg-light'
                      placeholder={`paidAmount (0)`}
                      step='0.01'
                      required
                    />
                    {errors && errors.paidAmount && (
                      <span className='text-danger'>
                        {errors.paidAmount.message}
                      </span>
                    )}
                  </div>
                </li>
              </>
            )}
          </ul>
          {subTotal && subTotal.length > 0 && (
            <>
              <button
                disabled={isLoadingAdd}
                className='btn btn-primary form-control mt'
              >
                {isLoadingAdd ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  <>
                    <FaMoneyBillAlt className='mb-1' /> SEND ORDER
                  </>
                )}
              </button>
              <button
                className='btn btn-outline-danger form-control mt-1'
                onClick={() => {
                  setCartItems([]), setSelectedCustomer('')
                }}
              >
                <FaTimesCircle className='mb-1' /> CANCEL ORDER
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default Cart
