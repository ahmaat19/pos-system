import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import { useMutation } from 'react-query'
import { searchTransactions } from '../../api/transaction-report'
import Loader from 'react-loader-spinner'
import Message from '../../components/Message'
import { FaInfoCircle } from 'react-icons/fa'
import moment from 'moment'
import { useForm } from 'react-hook-form'

const Transaction = () => {
  const [startDate, setStartDate] = useState(Date.now())
  const [endDate, setEndDate] = useState(Date.now())

  const { register, handleSubmit } = useForm({
    defaultValues: {},
  })

  const { isLoading, isError, error, mutateAsync, data } = useMutation(
    ['search-transactions'],
    searchTransactions,
    {
      retry: 0,
      onSuccess: () => {},
    }
  )

  const submitHandler = () => {
    mutateAsync({ startDate, endDate })
  }

  const totalDue =
    data &&
    data.length > 0 &&
    data.reduce(
      (acc, curr) => acc + (Number(curr.due) - Number(curr.paidAmount)),
      0
    )

  return (
    <div className='container'>
      <Head>
        <title>Transaction</title>
        <meta property='og:title' content='Transaction' key='title' />
      </Head>{' '}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='input-group'>
          <input
            type='date'
            {...register('startDate', { required: `Start date is required` })}
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
            className='form-control me-1'
          />
          <input
            type='date'
            {...register('endDate', { required: `End date is required` })}
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
            className='form-control'
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
                    <th>CREATED BY</th>
                    <th>CUSTOMER</th>
                    <th>TYPE</th>
                    <th>INVOICE</th>
                    <th>PAID AMOUNT</th>
                    <th>DUE BALANCE</th>
                    {/* <th>DETAILS</th> */}
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((d) => (
                      <tr key={d._id}>
                        <td>{moment(d.createdAt).format('llll')}</td>
                        <td>{d.createdBy && d.createdBy.name}</td>
                        <td>{d.customer && d.customer.name}</td>
                        <td>{d.type}</td>
                        <td>{d.invoice}</td>
                        {/* <td>${Number(d.totalPrice).toFixed(2)}</td> */}
                        <td>${Number(d.paidAmount).toFixed(2)}</td>
                        <td>${Number(d.due).toFixed(2)}</td>

                        {/* <td>
                          <button
                            className='btn btn-success btn-sm'
                            data-bs-toggle='modal'
                            data-bs-target='#itemDetailsModal'
                          >
                            <FaInfoCircle className='mb-1' /> Info
                          </button>
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Transaction)), {
  ssr: false,
})
