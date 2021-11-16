import React from 'react'
import { FaEnvelope, FaMapMarked, FaPhoneAlt } from 'react-icons/fa'

const contact = () => {
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-8 col-md-10 col-12 mx-auto text-center'>
          <h4 className='text-center display-6 fw-bold'>Contact</h4> <hr />
          <address>
            <FaPhoneAlt className='mb-1' />{' '}
            <a
              className='text-decoration-none text-black'
              href='tel:+252610760740'
            >
              {' '}
              +252 61 076 0740{' '}
            </a>{' '}
            <br />
            <FaEnvelope className='mb-1' />{' '}
            <a
              className='text-decoration-none text-black'
              href='mailto:info@ligomedical.com'
            >
              {' '}
              info@ligomedical.com{' '}
            </a>{' '}
            <br />
            <FaMapMarked className='mb-1' /> Bakaaro Market, Howlwadaag,
            Mogadishu - Somalia.
          </address>
        </div>
      </div>
    </div>
  )
}

export default contact
