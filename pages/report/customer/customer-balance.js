import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { useMutation, useQuery } from 'react-query'
import {
  searchCustomersByItem,
  searchCustomersByItemDetails,
} from '../../../api/customer-report'
import Loader from 'react-loader-spinner'
import Message from '../../../components/Message'
import { FaInfoCircle } from 'react-icons/fa'
import moment from 'moment'

const CustomerBalance = () => {
  const { isLoading, isError, error, data } = useQuery(
    ['customer-balance'],
    searchCustomersByItem,
    {
      retry: 0,
      onSuccess: () => {},
    }
  )

  const { mutateAsync: mutateAsyncItemDetails, data: dataItemDetails } =
    useMutation(['customer-balance-details'], searchCustomersByItemDetails, {
      retry: 0,
      onSuccess: () => {},
    })

  const totalPrice =
    data &&
    data.length > 0 &&
    data.reduce((acc, curr) => acc + Number(curr.due), 0)

  const totalDue =
    dataItemDetails &&
    dataItemDetails.length > 0 &&
    dataItemDetails.reduce((acc, curr) => acc + Number(curr.due), 0)

  const totalPaidAmount =
    dataItemDetails &&
    dataItemDetails.length > 0 &&
    dataItemDetails.reduce((acc, curr) => acc + Number(curr.paidAmount), 0)

  return (
    <div className='container'>
      <Head>
        <title>Customers by item summary report</title>
        <meta
          property='og:title'
          content='Customers by item summary report'
          key='title'
        />
      </Head>{' '}
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
                  <th>CUSTOMER</th>
                  <th>MOBILE</th>
                  <th>DUE AMOUNT</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.length > 0 &&
                  data.map((order) => (
                    <tr key={order._id}>
                      <td>{order.customer && order.customer.name}</td>
                      <td>{order.customer && order.customer.mobile}</td>
                      <td>${Number(order.due).toFixed(2)}</td>

                      <td className='btn-group'>
                        <button
                          className='btn btn-success btn-sm'
                          data-bs-toggle='modal'
                          data-bs-target='#itemDetailsModal'
                          onClick={() =>
                            mutateAsyncItemDetails({
                              customer: order.customer && order.customer._id,
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
                    <th colSpan='2'>TOTAL</th>
                    <th className='text-decoration'>
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
                          <th>INVOICE</th>
                          <th>CUSTOMER</th>
                          <th>DUE AMOUNT</th>
                          <th>PAID AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataItemDetails &&
                          dataItemDetails.length > 0 &&
                          dataItemDetails.map((pro) => (
                            <tr key={pro._id}>
                              <td>{moment(pro.createdAt).format('llll')}</td>
                              <td>{pro.invoice}</td>
                              <td>{pro.customer && pro.customer.name}</td>
                              <td>${Number(pro.due).toFixed(2)}</td>
                              <td>${Number(pro.paidAmount).toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                      {dataItemDetails && dataItemDetails.length > 0 && (
                        <tfoot>
                          <tr>
                            <th colSpan='3'> TOTAL</th>
                            <th className='text-decoration'>
                              ${Number(totalDue).toFixed(2)}
                            </th>
                            <th className='text-decoration'>
                              ${Number(totalPaidAmount).toFixed(2)}
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

export default dynamic(() => Promise.resolve(withAuth(CustomerBalance)), {
  ssr: false,
})
