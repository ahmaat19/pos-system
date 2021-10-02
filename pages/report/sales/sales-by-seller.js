import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { useMutation, useQuery } from 'react-query'
import {
  searchSalesBySeller,
  searchSalesBySellerDetails,
} from '../../../api/sales-report'
import { getAllUsers } from '../../../api/users'
import Loader from 'react-loader-spinner'
import Message from '../../../components/Message'
import { FaInfoCircle } from 'react-icons/fa'
import moment from 'moment'
import { dynamicInputSelect } from '../../../utils/dynamicForm'
import { useForm } from 'react-hook-form'

const SalesSeller = () => {
  const [startDate, setStartDate] = useState(Date.now())
  const [endDate, setEndDate] = useState(Date.now())

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const { isLoading, isError, error, mutateAsync, data } = useMutation(
    ['search-sales-by-seller'],
    searchSalesBySeller,
    {
      retry: 0,
      onSuccess: () => {},
    }
  )

  const { data: usersData } = useQuery('users', () => getAllUsers(), {
    retry: 0,
  })

  const { mutateAsync: mutateAsyncItemDetails, data: dataItemDetails } =
    useMutation(
      ['search-sales-by-seller-details'],
      searchSalesBySellerDetails,
      {
        retry: 0,
        onSuccess: () => {},
      }
    )

  const submitHandler = (data) => {
    mutateAsync({ startDate, endDate, seller: data.seller })
  }

  const totalQty =
    data &&
    data.length > 0 &&
    data.reduce((acc, curr) => acc + Number(curr.qty), 0)

  const totalPrice =
    data &&
    data.length > 0 &&
    data.reduce((acc, curr) => acc + Number(curr.price), 0)

  const totalQtyDetails =
    dataItemDetails &&
    dataItemDetails.length > 0 &&
    dataItemDetails.reduce((acc, curr) => acc + Number(curr.qty), 0)

  const totalPriceDetails =
    dataItemDetails &&
    dataItemDetails.length > 0 &&
    dataItemDetails.reduce(
      (acc, curr) => acc + Number(curr.price) * Number(curr.qty),
      0
    )

  return (
    <div className='container'>
      <Head>
        <title>Sales by item summary report</title>
        <meta
          property='og:title'
          content='Sales by item summary report'
          key='title'
        />
      </Head>{' '}
      <form onSubmit={handleSubmit(submitHandler)}>
        {dynamicInputSelect({
          register,
          errors,
          name: 'seller',
          label: 'Seller',
          data: usersData && usersData,
        })}
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
          <div className='table-responsive '>
            <table className='table table-striped table-hover caption-top table-sm '>
              <caption>{data ? data.length : 0} records were found</caption>
              <thead>
                <tr>
                  <th>SELLER</th>
                  <th>QUANTITY</th>
                  <th>AMOUNT</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.length > 0 &&
                  data.map((order) => (
                    <tr key={order._id}>
                      <td>{order.seller.name}</td>
                      <td>{order.qty}</td>
                      <td>${Number(order.price).toFixed(2)}</td>

                      <td className='btn-group'>
                        <button
                          className='btn btn-success btn-sm'
                          data-bs-toggle='modal'
                          data-bs-target='#itemDetailsModal'
                          onClick={() =>
                            mutateAsyncItemDetails({
                              startDate,
                              endDate,
                              seller: order.seller,
                            })
                          }
                        >
                          <FaInfoCircle className='mb-1' /> Info
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
              {data && data.length > 0 && (
                <tfoot>
                  <tr>
                    <th>TOTAL</th>
                    <th>{Number(totalQty)}</th>
                    <th colSpan='2' className='text-decoration'>
                      ${Number(totalPrice).toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          <div
            className='modal fade'
            id='itemDetailsModal'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabIndex='-1'
            aria-labelledby='itemDetailsModalLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-xl'>
              <div className='modal-content modal-background'>
                <div className='modal-header'>
                  <h3 className='modal-title ' id='itemDetailsModalLabel'>
                    Details
                  </h3>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                  <div className='table-responsive '>
                    <table className='table table-striped table-hover caption-top table-sm '>
                      <caption>
                        {dataItemDetails ? dataItemDetails.length : 0} records
                        were found
                      </caption>
                      <thead>
                        <tr>
                          <th>DATE & TIME</th>
                          <th>CUSTOMER</th>
                          <th>ITEM</th>
                          <th>QUANTITY</th>
                          <th>AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataItemDetails &&
                          dataItemDetails.length > 0 &&
                          dataItemDetails.map((pro) => (
                            <tr key={pro._id}>
                              <td>{moment(pro.createdAt).format('llll')}</td>
                              <td>{pro.customer && pro.customer.name}</td>
                              <td>{pro.name}</td>
                              <td>{pro.qty}</td>
                              <td>
                                $
                                {(Number(pro.price) * Number(pro.qty)).toFixed(
                                  2
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                      {dataItemDetails && dataItemDetails.length > 0 && (
                        <tfoot>
                          <tr>
                            <th colSpan='3'> TOTAL</th>
                            <th>{Number(totalQtyDetails)}</th>
                            <th className='text-decoration'>
                              ${Number(totalPriceDetails).toFixed(2)}
                            </th>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(SalesSeller)), {
  ssr: false,
})
