import { useRef, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { useMutation, useQuery } from 'react-query'
import { searchSalesBySeller } from '../../../api/sales-report'
import { getAllUsers } from '../../../api/users'
import Loader from 'react-loader-spinner'
import Message from '../../../components/Message'
import { FaInfoCircle, FaPrint } from 'react-icons/fa'
import moment from 'moment'
import { dynamicInputSelect } from '../../../utils/dynamicForm'
import { useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import Invoice from '../../../components/Invoice'

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

  const submitHandler = (data) => {
    mutateAsync({ startDate, endDate, seller: data.seller })
  }

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
  })

  const [printItems, setPrintItems] = useState('')

  const totalDue =
    data &&
    data.length > 0 &&
    data.reduce((acc, curr) => acc + Number(curr.due), 0)

  const totalPaidAmount =
    data &&
    data.length > 0 &&
    data.reduce((acc, curr) => acc + Number(curr.paidAmount), 0)

  // const subTotal = (items) => {
  //   return (
  //     items &&
  //     items.length > 0 &&
  //     items.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)
  //   )
  // }

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
          {data && data.length > 0 && (
            <div className='table-responsive '>
              <table className='table table-striped table-hover caption-top table-sm '>
                <caption>{data ? data.length : 0} records were found</caption>
                <thead>
                  <tr>
                    <th>SELLER</th>
                    <th>AMOUNT</th>
                    <th>DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {data &&
                        data[0] &&
                        data[0].createdBy &&
                        data[0].createdBy.name}
                    </td>
                    <td>${Number(totalPaidAmount).toFixed(2)}</td>

                    <td>
                      <button
                        className='btn btn-success btn-sm'
                        data-bs-toggle='modal'
                        data-bs-target='#itemDetailsModal'
                      >
                        <FaInfoCircle className='mb-1' /> Info
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Print Invoice Info */}

          <div
            className='modal fade'
            id='invoiceView'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabIndex='-1'
            aria-labelledby='invoiceViewLabel'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-xl'>
              <div className='modal-content modal-background'>
                <div className='modal-header'>
                  <h3 className='modal-title ' id='invoiceViewLabel'>
                    Invoice
                  </h3>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div className='modal-body'>
                  <div className='card' ref={componentRef}>
                    <Invoice cartItems={printItems} />
                  </div>

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
                      data-bs-dismiss='modal'
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      onClick={handlePrint}
                    >
                      <FaPrint className='mb-1' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Print  */}
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
                        {data ? data.length : 0} records were found
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
                        {data &&
                          data.length > 0 &&
                          data.map((pro) => (
                            <tr
                              key={pro._id}
                              data-bs-toggle='modal'
                              data-bs-target='#invoiceView'
                              onClick={() => setPrintItems(pro)}
                            >
                              <td>{moment(pro.createdAt).format('llll')}</td>
                              <td>{pro.invoice}</td>
                              <td>{pro.customer && pro.customer.name}</td>
                              <td>${Number(pro.due).toFixed(2)}</td>
                              <td>${Number(pro.paidAmount).toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                      {data && data.length > 0 && (
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

export default dynamic(() => Promise.resolve(withAuth(SalesSeller)), {
  ssr: false,
})
