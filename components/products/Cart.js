import React from 'react'
import Image from 'next/image'
import { FaPlug, FaPlus, FaUsers } from 'react-icons/fa'

const Cart = ({ cartItems }) => {
  return (
    <div className='border border-top-0 border-end-0 border-bottom-0 border-light px-2'>
      <div className='d-flex justify-content-between'>
        <button className='btn btn-primary btn-sm'>
          <FaUsers className='mb-1' /> Customers
        </button>
        <button className='btn btn-primary btn-sm'>
          <FaPlus className='mb-1' /> New
        </button>
      </div>
      <hr />
      {cartItems &&
        cartItems.length > 0 &&
        cartItems.map((item) => (
          <div key={item._id} className='card'>
            <ul className='list-group list-group-flush'>
              <li className='list-group-item'>
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
                      x{item.stock}{' '}
                      <span className='visually-hidden'>unread messages</span>
                    </span>
                  </button>
                  <span className='text-primary fw-bold fs-5'>
                    ${item.price}
                  </span>
                </div>
                <div className='text-center'>{item.item}</div>
              </li>
              <li className='list-group-item'>
                <div className='d-flex justify-content-between'>
                  <span>Subtotal</span> <span> ${item.price}</span>
                </div>
              </li>
              <li className='list-group-item'>
                <div className='mb-1'>
                  <input
                    type='number'
                    step='0.01'
                    max={item.stock}
                    placeholder='Discount'
                    className='form-control form-control-sm bg-light'
                  />
                </div>
              </li>
            </ul>
            <div className='card-footer'>
              <div className='d-flex justify-content-between fw-bold'>
                <span>Total</span> <span> ${item.price}</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Cart
