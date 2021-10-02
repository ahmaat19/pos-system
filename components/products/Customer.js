import React, { useState } from 'react'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import { FaCheckCircle, FaEdit, FaTimesCircle, FaTrash } from 'react-icons/fa'

import {
  getCustomers,
  updateCustomer,
  deleteCustomer,
  addCustomer,
} from '../../api/customer'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import { inputCheckBox, inputText } from '../../utils/dynamicForm'

const Customer = ({ setSelectedCustomer }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'customers',
    () => getCustomers(),
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
  } = useMutation(updateCustomer, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['customers'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteCustomer, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['customers']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addCustomer, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['customers'])
    },
  })

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateMutateAsync({
          _id: id,
          name: data.name,
          mobile: data.mobile,
          address: data.address,
          isActive: data.isActive,
        })
      : addMutateAsync(data)
  }

  const editHandler = (customer) => {
    setId(customer._id)
    setEdit(true)
    setValue('name', customer.name)
    setValue('mobile', customer.mobile)
    setValue('address', customer.address)
    setValue('isActive', customer.isActive)
  }

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
              Customers
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
            {isSuccessUpdate && (
              <Message variant='success'>
                Customer has been updated successfully.
              </Message>
            )}
            {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {isSuccessAdd && (
              <Message variant='success'>
                Customer has been Created successfully.
              </Message>
            )}
            {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
            {isSuccessDelete && (
              <Message variant='success'>
                Customer has been deleted successfully.
              </Message>
            )}
            {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

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
              <form onSubmit={handleSubmit(submitHandler)}>
                <div className='row'>
                  <div className='col-md-4 col-12'>
                    {inputText({
                      register,
                      label: 'Name',
                      errors,
                      name: 'name',
                    })}
                  </div>
                  <div className='col-md-4 col-12'>
                    {inputText({
                      register,
                      label: 'Mobile',
                      errors,
                      name: 'mobile',
                    })}
                  </div>
                  <div className='col-md-4 col-12'>
                    {inputText({
                      register,
                      label: 'Address',
                      errors,
                      name: 'address',
                    })}
                  </div>
                </div>

                <div className='row'>
                  <div className='col'>
                    {inputCheckBox({
                      register,
                      errors,
                      label: 'isActive',
                      name: 'isActive',
                      isRequired: false,
                    })}
                  </div>
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
                    disabled={isLoadingAdd || isLoadingUpdate}
                  >
                    {isLoadingAdd || isLoadingUpdate ? (
                      <span className='spinner-border spinner-border-sm' />
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            )}
            <hr />

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
              data &&
              data.length > 0 && (
                <>
                  <div className='table-responsive '>
                    <table className='table table-striped table-hover caption-top table-sm '>
                      <caption>
                        {data && data.length} records were found
                      </caption>
                      <thead>
                        <tr>
                          <th>NAME</th>
                          <th>MOBILE</th>
                          <th>ADDRESS</th>
                          <th>ACTIVE</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data &&
                          data.map((customer) => (
                            <tr key={customer._id}>
                              <td
                                onClick={() =>
                                  setSelectedCustomer({
                                    _id: customer._id,
                                    name: customer.name,
                                  })
                                }
                                data-bs-dismiss='modal'
                              >
                                {customer.name.charAt(0).toUpperCase() +
                                  customer.name.slice(1)}
                              </td>
                              <td>{customer.mobile}</td>
                              <td>{customer.address}</td>
                              <td>
                                {customer.isActive ? (
                                  <FaCheckCircle className='text-success mb-1' />
                                ) : (
                                  <FaTimesCircle className='text-danger mb-1' />
                                )}
                              </td>

                              <td className='btn-group'>
                                <button
                                  className='btn btn-primary btn-sm'
                                  onClick={() => editHandler(customer)}
                                >
                                  <FaEdit className='mb-1' /> Edit
                                </button>

                                <button
                                  className='btn btn-danger btn-sm'
                                  onClick={() => deleteHandler(customer._id)}
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
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customer
