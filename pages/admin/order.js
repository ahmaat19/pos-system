import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import Image from 'next/image'
import { FaEdit, FaInfoCircle, FaPrint, FaTrash } from 'react-icons/fa'
import Pagination from '../../components/Pagination'
import { getOrders, updateOrder, deleteOrder } from '../../api/order'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useReactToPrint } from 'react-to-print'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'

const Orders = () => {
  const [page, setPage] = useState(1)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Clearance',
  })

  const [cartItems, setCartItems] = useState('')

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'orders',
    () => getOrders(page),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(['update'], updateOrder, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['orders'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(['delete'], deleteOrder, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['orders']),
  })

  const [id, setId] = useState(null)

  const formCleanHandler = () => {
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const submitHandler = (data) => {
    updateMutateAsync({
      _id: id,
      paidAmount: data.paidAmount,
      discount: data.discount,
    })
  }

  const editHandler = (order) => {
    setId(order._id)
    setValue('paidAmount', order.paidAmount)
    setValue('discount', order.discount)
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('orders')
    }
    refetch()
  }, [page, queryClient])

  const subTotal = (items) => {
    return (
      items &&
      items.length > 0 &&
      items.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)
    )
  }

  return (
    <div className='container'>
      <Head>
        <title>Orders</title>
        <meta property='og:title' content='Orders' key='title' />
      </Head>
      {isSuccessDelete && (
        <Message variant='success'>
          Order has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>
          Order has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

      <div
        className='modal fade'
        id='editOrderModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editOrderModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editOrderModalLabel'>
                Edit Order
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
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
                  <form onSubmit={handleSubmit(submitHandler)}>
                    <div className='card'>
                      <ul className='list-group list-group-flush'>
                        {cartItems.orderItems &&
                          cartItems.orderItems.length > 0 &&
                          cartItems.orderItems.map((item) => (
                            <li key={item._id} className='list-group-item mt-1'>
                              <div className='d-flex justify-content-between'>
                                <button
                                  type='button'
                                  className='btn position-relative bg-transparent shadow-sm py-0 px-1 rounded-3'
                                >
                                  {item.product && item.product.picture && (
                                    <Image
                                      width='35'
                                      height='35'
                                      priority
                                      src={
                                        item.product.picture &&
                                        item.product.picture.picturePath
                                      }
                                      alt={
                                        item.product.picture &&
                                        item.product.picture.pictureName
                                      }
                                      className='img-fluid rounded-pill my-auto '
                                    />
                                  )}
                                  <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill'>
                                    x{item.qty}{' '}
                                  </span>
                                </button>
                                <div className='text-center'>{item.name}</div>
                                <span className='text-primary fw-bold'>
                                  $
                                  {(
                                    Number(item.price) * Number(item.qty)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </li>
                          ))}

                        <>
                          <li className='list-group-item'>
                            <div className='fw-bold d-flex justify-content-between'>
                              <h6>Subtotal</h6>{' '}
                              <h6>
                                {' '}
                                $
                                {Number(
                                  subTotal(cartItems && cartItems.orderItems)
                                )}
                              </h6>
                            </div>
                            <div className='fw-bold d-flex justify-content-between'>
                              <h6>Discount</h6>{' '}
                              <h6>
                                {' '}
                                ${watch().discount ? watch().discount : 0}
                              </h6>
                            </div>
                            <div className='d-flex justify-content-between fw-bold text-danger'>
                              <h6>Due</h6>{' '}
                              <h6>
                                $
                                {(
                                  Number(
                                    subTotal(cartItems && cartItems.orderItems)
                                  ) -
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
                                placeholder={`discount (${subTotal(
                                  cartItems && cartItems.orderItems
                                )})`}
                                step='0.01'
                                max={Number(
                                  subTotal(cartItems && cartItems.orderItems)
                                )}
                                {...register('discount', {
                                  required: 'required!',
                                })}
                                required
                              />
                              {errors && errors.discount && (
                                <span className='text-danger'>
                                  {errors.discount.message}
                                </span>
                              )}
                              <input
                                type='number'
                                max={subTotal(
                                  cartItems && cartItems.orderItems
                                )}
                                {...register('paidAmount', {
                                  required: 'required!',
                                })}
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
                      </ul>
                    </div>

                    <div className='modal-footer'>
                      <button
                        type='button'
                        className='btn btn-secondary '
                        data-bs-dismiss='modal'
                        onClick={formCleanHandler}
                      >
                        Close
                      </button>
                      <button
                        type='submit'
                        className='btn btn-primary '
                        disabled={isLoadingUpdate}
                      >
                        {isLoadingUpdate ? (
                          <span className='spinner-border spinner-border-sm' />
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print ----------------------------> */}

      <div
        className='modal fade'
        id='printOrderModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='printOrderModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='printOrderModalLabel'>
                Print Preview
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
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
                  <div className='card' ref={componentRef}>
                    <ul className='list-group list-group-flush'>
                      <li className='list-group-item mt-1 text-center'>
                        <span className='fw-bold'>INVOICE ID: </span>
                        {cartItems && cartItems._id}
                      </li>
                      {cartItems.orderItems &&
                        cartItems.orderItems.length > 0 &&
                        cartItems.orderItems.map((item) => (
                          <li key={item._id} className='list-group-item mt-1'>
                            <div className='d-flex justify-content-between'>
                              <button
                                type='button'
                                className='btn position-relative bg-transparent shadow-sm py-0 px-1 rounded-3'
                              >
                                {item.product && item.product.picture && (
                                  <Image
                                    width='35'
                                    height='35'
                                    priority
                                    src={
                                      item.product.picture &&
                                      item.product.picture.picturePath
                                    }
                                    alt={
                                      item.product.picture &&
                                      item.product.picture.pictureName
                                    }
                                    className='img-fluid rounded-pill my-auto '
                                  />
                                )}
                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill'>
                                  x{item.qty}{' '}
                                </span>
                              </button>
                              <div className='text-center'>{item.name}</div>
                              <span className='text-primary fw-bold'>
                                $
                                {(
                                  Number(item.price) * Number(item.qty)
                                ).toFixed(2)}
                              </span>
                            </div>
                          </li>
                        ))}

                      <>
                        <li className='list-group-item'>
                          <div className='fw-bold d-flex justify-content-between'>
                            <h6>Subtotal</h6>{' '}
                            <h6>
                              {' '}
                              $
                              {Number(
                                subTotal(cartItems && cartItems.orderItems)
                              )}
                            </h6>
                          </div>
                          <div className='fw-bold d-flex justify-content-between'>
                            <h6>Discount</h6>{' '}
                            <h6> ${cartItems && cartItems.discount}</h6>
                          </div>
                          <div className='d-flex justify-content-between fw-bold text-danger'>
                            <h6>Due</h6>{' '}
                            <h6>
                              $
                              {(
                                Number(
                                  subTotal(cartItems && cartItems.orderItems)
                                ) -
                                Number(cartItems.discount) -
                                Number(cartItems.paidAmount)
                              ).toFixed(2)}
                            </h6>
                          </div>
                        </li>
                      </>
                    </ul>
                  </div>
                </>
              )}

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

      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Orders</h3>
        <Pagination data={data} setPage={setPage} />
      </div>

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
              <caption>{data && data.total} records were found</caption>
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>MOBILE</th>
                  <th>TOTAL PRICE</th>
                  <th>PAID AMOUNT</th>
                  <th>DISCOUNT</th>
                  <th>DUE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((order) => (
                    <tr
                      key={order._id}
                      className={
                        Number(order.totalPrice) -
                          Number(order.discount) -
                          Number(order.paidAmount) >
                        0
                          ? 'text-danger'
                          : ''
                      }
                    >
                      <td>{order.customer.name}</td>
                      <td>{order.customer.mobile}</td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>${order.paidAmount.toFixed(2)}</td>
                      <td>${order.discount.toFixed(2)}</td>
                      <td>
                        $
                        {(
                          Number(order.totalPrice) -
                          Number(order.discount) -
                          Number(order.paidAmount)
                        ).toFixed(2)}
                      </td>

                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => {
                            setCartItems(order), editHandler(order)
                          }}
                          data-bs-toggle='modal'
                          data-bs-target='#editOrderModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>
                        <button
                          className='btn btn-success btn-sm mx-1'
                          onClick={() => {
                            setCartItems(order)
                          }}
                          data-bs-toggle='modal'
                          data-bs-target='#printOrderModal'
                        >
                          <FaInfoCircle className='mb-1' /> Info
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(order._id)}
                          disabled={isLoadingDelete}
                        >
                          {isLoadingDelete ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              {' '}
                              <FaTrash className='mb-1' /> Delete
                            </span>
                          )}
                        </button>
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

export default dynamic(() => Promise.resolve(withAuth(Orders)), { ssr: false })
