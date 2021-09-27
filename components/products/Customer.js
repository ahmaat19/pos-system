import React from 'react'

const Customer = () => {
  return (
    <div
      className='modal fade'
      id='homeCustomerModal'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex='-1'
      aria-labelledby='homeCustomerModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content modal-background'>
          <div className='modal-header'>
            <h3 className='modal-title ' id='homeCustomerModalLabel'>
              {/* {edit ? 'Edit Group' : 'Add Group'} */} Helo
            </h3>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              // onClick={formCleanHandler}
            ></button>
          </div>
          <div className='modal-body'></div>
        </div>
      </div>
    </div>
  )
}

export default Customer
