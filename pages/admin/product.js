import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import {
  getProducts,
  updateProduct,
  deleteProduct,
  addProduct,
} from '../../api/product'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'

import {
  dynamicInputSelect,
  inputCheckBox,
  inputFile,
  inputNumber,
  inputText,
  staticInputSelect,
} from '../../utils/dynamicForm'
import { getCategories } from '../../api/category'

const Product = () => {
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

  const queryClient = useQueryClient()

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [file, setFile] = useState('')
  const [imageDisplay, setImageDisplay] = useState('')

  const { data, isLoading, isError, error } = useQuery(
    'products',
    () => getProducts(),
    {
      retry: 0,
    }
  )

  const { data: categories } = useQuery('categories', () => getCategories(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(updateProduct, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setFile('')
      setImageDisplay('')
      queryClient.invalidateQueries(['products'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteProduct, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['products']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addProduct, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setFile('')
      setImageDisplay('')
      queryClient.invalidateQueries(['products'])
    },
  })

  const formCleanHandler = () => {
    setEdit(false)
    setFile('')
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  useEffect(() => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageDisplay(reader.result)
    })
    file && reader.readAsDataURL(file)
  }, [file])

  const submitHandler = (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('cost', data.cost)
    formData.append('price', data.price)
    formData.append('unit', data.unit)
    formData.append('stock', data.stock)
    formData.append('category', data.category)
    formData.append('picture', file)
    formData.append('isActive', data.isActive)

    edit
      ? updateMutateAsync({
          _id: id,
          formData,
        })
      : addMutateAsync(formData)
  }

  const editHandler = (product) => {
    setId(product._id)
    setEdit(true)
    setValue('name', product.name)
    setValue('cost', product.cost)
    setValue('price', product.price)
    setValue('unit', product.unit)
    setValue('stock', product.stock)
    setValue('category', product.category._id)
    setValue('isActive', product.isActive)

    setImageDisplay(product.picture && product.picture.picturePath)
  }

  return (
    <div className='container'>
      <Head>
        <title>Product</title>
        <meta property='og:title' content='Product' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Product has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Product has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Product has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editProductModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editProductModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editProductModalLabel'>
                {edit ? 'Edit Product' : 'Add Product'}
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
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className='row'>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        label: 'Name',
                        errors,
                        name: 'name',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {dynamicInputSelect({
                        register,
                        label: 'Category',
                        errors,
                        name: 'category',
                        data: categories && categories,
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {staticInputSelect({
                        register,
                        label: 'Unit',
                        errors,
                        name: 'unit',
                        data: [
                          { name: 'ltr' },
                          { name: 'pcs' },
                          { name: 'kg' },
                          { name: 'grm' },
                          { name: 'box' },
                          { name: 'no' },
                        ],
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {inputNumber({
                        register,
                        label: 'Cost',
                        errors,
                        name: 'cost',
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {inputNumber({
                        register,
                        label: 'Price',
                        errors,
                        name: 'price',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputNumber({
                        register,
                        label: 'Stock',
                        errors,
                        name: 'stock',
                      })}
                    </div>

                    <div className='col-md-4 col-10'>
                      {inputFile({
                        register,
                        errors,
                        name: 'picture',
                        label: 'Product Picture',
                        setFile,
                        isRequired: false,
                      })}
                    </div>
                    <div className='col-2 my-auto pt-3'>
                      {imageDisplay && (
                        <Image
                          width='35'
                          height='35'
                          priority
                          className='img-fluid rounded-pill my-auto'
                          src={imageDisplay}
                          alt={imageDisplay}
                        />
                      )}
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
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Products</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editProductModal'
        >
          <FaPlus className='mb-1' />
        </button>
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
              <caption>{data && data.length} records were found</caption>
              <thead>
                <tr>
                  <th>IMAGE </th>
                  <th>PRODUCT </th>
                  <th>CATEGORY</th>
                  <th>COST</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((product) => (
                    <tr key={product._id}>
                      <td>
                        {product.picture && (
                          <Image
                            width='27'
                            height='27'
                            priority
                            className='img-fluid rounded-pill'
                            src={product.picture && product.picture.picturePath}
                            alt={product.picture && product.picture.pictureName}
                          />
                        )}
                      </td>
                      <td>
                        {product.name.charAt(0).toUpperCase() +
                          product.name.slice(1)}
                      </td>

                      <td>{product.category.name}</td>
                      <td>${product.cost.toFixed(2)}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>

                      <td>
                        {product.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(product)}
                          data-bs-toggle='modal'
                          data-bs-target='#editProductModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(product._id)}
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

export default dynamic(() => Promise.resolve(withAuth(Product)), {
  ssr: false,
})
