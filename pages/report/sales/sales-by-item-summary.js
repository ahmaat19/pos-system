import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { useMutation } from 'react-query'
import { searchSalesByItem } from '../../../api/sales-report'
import Loader from 'react-loader-spinner'
import Message from '../../../components/Message'
import { FaInfoCircle } from 'react-icons/fa'

const SalesItem = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { isLoading, isError, error, mutateAsync, data } = useMutation(
    ['search-sales-by-item'],
    searchSalesByItem,
    {
      retry: 0,
      onSuccess: () => {},
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    mutateAsync({ startDate, endDate })
  }

  return (
    <div>
      <Head>
        <title>Sales by item summary report</title>
        <meta
          property='og:title'
          content='Sales by item summary report'
          key='title'
        />
      </Head>{' '}
      <form onSubmit={handleSubmit}>
        <div className='input-group'>
          <input
            type='date'
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
            className='form-control me-1'
          />
          <input
            type='date'
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
          <div className='table-responsive '>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{data ? data.length : 0} records were found</caption>
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>QUANTITY</th>
                  <th>AMOUNT</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.length > 0 &&
                  data.map((order) => (
                    <tr key={order._id}>
                      <td>{order.name}</td>
                      <td>{order.qty}</td>
                      <td>
                        ${(Number(order.price) * Number(order.qty)).toFixed(2)}
                      </td>

                      <td className='btn-group'>
                        <Link href='/test'>
                          <a
                            className='btn btn-success btn-sm mx-1'
                            data-bs-toggle='modal'
                            data-bs-target='#printOrderModal'
                          >
                            <FaInfoCircle className='mb-1' /> Info
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(SalesItem)), {
  ssr: false,
})
