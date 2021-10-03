import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { useMutation } from 'react-query'
import { receiptMoney, searchCustomer } from '../api/receipt'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import { FaInfoCircle, FaMoneyBillAlt, FaUsb } from 'react-icons/fa'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { inputNumber } from '../utils/dynamicForm'

const Receipt = () => {
  const [customerMobile, setCustomerMobile] = useState('')
  const [order, setOrder] = useState('')
  const { register: registerCustomer, handleSubmit: handleSubmitCustomer } =
    useForm({
      defaultValues: {},
    })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const { isLoading, isError, error, mutateAsync, data } = useMutation(
    ['search-customer'],
    searchCustomer,
    {
      retry: 0,
      onSuccess: () => {},
    }
  )

  const {
    isLoading: isLoadingReceipt,
    isError: isErrorReceipt,
    isSuccess: isSuccessReceipt,
    error: errorReceipt,
    mutateAsync: mutateAsyncReceipt,
  } = useMutation(['receipt money'], receiptMoney, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandlerCustomer = () => {
    mutateAsync(customerMobile)
  }

  const submitHandler = (data) => {
    // mutateAsync(customerMobile)
    mutateAsyncReceipt({ receipt: data.receipt, order })
  }

  return (
    <div className='container'>
      <Head>
        <title>Receipt</title>
        <meta property='og:title' content='Receipt' key='title' />
      </Head>{' '}
      {isSuccessReceipt && (
        <Message variant='success'>Receipt has been done successfully.</Message>
      )}
      {isErrorReceipt && <Message variant='danger'>{errorReceipt}</Message>}
      <form onSubmit={handleSubmitCustomer(submitHandlerCustomer)}>
        <div className='input-group'>
          <input
            type='number'
            {...registerCustomer('customerMobile', {
              required: `Customer mobile is required`,
            })}
            onChange={(e) => setCustomerMobile(e.target.value)}
            value={customerMobile}
            className='form-control me-1'
          />

          <button className='btn btn-primary ms-1'>Search</button>
        </div>
      </form>
      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          {data && data.length > 0 && (
            <div className='table-responsive '>
              <table className='table table-striped table-hover caption-top table-sm '>
                <caption>{data ? data.length : 0} records were found</caption>
                <thead>
                  <tr>
                    <th>DATE & TIME</th>
                    <th>CUSTOMER</th>
                    <th>INVOICE</th>
                    <th>DUE BALANCE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((d) => (
                      <tr key={d._id}>
                        <td>{moment(d.createdAt).format('llll')}</td>
                        <td>{d.customer && d.customer.name}</td>
                        <td>{d.invoice}</td>
                        <td>${Number(d.due).toFixed(2)}</td>

                        <td>
                          <button
                            onClick={() => setOrder(d)}
                            className='btn btn-success btn-sm'
                            data-bs-toggle='modal'
                            data-bs-target='#receiptModal'
                          >
                            <FaMoneyBillAlt className='mb-1' /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          <div
            className='modal fade'
            id='receiptModal'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabIndex='-1'
            aria-labelledby='receiptModalLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog'>
              <div className='modal-content modal-background'>
                <div className='modal-header'>
                  <h3 className='modal-title ' id='receiptModalLabel'>
                    Receipt
                  </h3>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                    onClick={() => reset()}
                  ></button>
                </div>
                <div className='modal-body'>
                  <form onSubmit={handleSubmit(submitHandler)}>
                    {inputNumber({
                      register,
                      label: 'Receipt Money',
                      errors,
                      name: 'receipt',
                    })}
                    <div className='modal-footer'>
                      <button
                        type='button'
                        className='btn btn-secondary '
                        data-bs-dismiss='modal'
                        onClick={() => reset()}
                      >
                        Close
                      </button>
                      <button
                        type='submit'
                        className='btn btn-primary '
                        disabled={isLoadingReceipt}
                      >
                        {isLoadingReceipt ? (
                          <span className='spinner-border spinner-border-sm' />
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Receipt)), {
  ssr: false,
})
