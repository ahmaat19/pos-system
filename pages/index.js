import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { ProductList, Category, Cart } from '../components/products'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { addOrder } from '../api/order'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import Message from '../components/Message'
import { getCategories } from '../api/category'
import { getProducts } from '../api/product'
import Loader from 'react-loader-spinner'

function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const [selectedCustomer, setSelectedCustomer] = useState('')

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(1)
  const [cartItems, setCartItems] = useState([])
  const [discount, setDiscount] = useState([])

  const queryClient = useQueryClient()

  const { data: categoriesValue } = useQuery(
    'categories',
    () => getCategories(),
    {
      retry: 0,
    }
  )

  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useQuery('products', () => getProducts(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addOrder, {
    retry: 0,
    onSuccess: () => {
      reset()
      setCartItems([])
      setSelectedCustomer('')
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['products'])
    },
  })

  const filtered_Products =
    productData &&
    productData.filter(
      (p) =>
        // p.isActive &&
        p.name && p.name.toLowerCase().includes(search && search.toLowerCase())
    )
  const removeFromCart = (product) => {
    const items = cartItems.filter((c) => c.product !== product._id)
    setCartItems(items)
  }
  const cart = (singleProduct) => {
    const {
      category,
      picture,
      price,
      cost,
      stock,
      unit,
      name,
      _id: product,
    } = singleProduct
    const prevProducts = [...cartItems]
    if (prevProducts.length > 0) {
      const products = prevProducts.filter((p) => p.product === product)
      if (products.length > 0) {
        setCartItems([
          ...cartItems.filter((p) => p.product !== product),
          {
            category,
            picture,
            price,
            cost,
            stock,
            unit,
            name,
            product,
            qty: Number(products[0].qty) + 1,
          },
        ])
      } else {
        setCartItems([
          ...prevProducts,
          {
            category,
            picture,
            price,
            cost,
            stock,
            unit,
            name,
            product,
            qty: 1,
          },
        ])
      }
    } else {
      setCartItems([
        { category, picture, price, cost, stock, unit, name, product, qty: 1 },
      ])
    }
  }

  const submitHandler = async (data) => {
    addMutateAsync({
      discount: data.discount,
      paidAmount: data.paidAmount,
      cartItems,
      customer: selectedCustomer._id,
    })
  }

  return (
    <div>
      <Head>
        <title>Point Of Sale</title>
        <meta property='og:title' content='Point Of Sale' key='title' />
      </Head>
      {isSuccessAdd && (
        <Message variant='success'>Order has been saved successfully.</Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}

      <div className='row g-1'>
        <div className='col-md-8 col-12'>
          <div className='mb-3'>
            <input
              type='text'
              className='form-control'
              name='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Type to search'
            />
          </div>

          <Category
            categories={categoriesValue && categoriesValue}
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
          />
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
            <ProductList
              products={filtered_Products}
              activeCategory={activeCategory}
              cart={cart}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
          )}
        </div>
        <div className='col-md-4 col-12'>
          <Cart
            cartItems={cartItems}
            discount={discount}
            setDiscount={setDiscount}
            submitHandler={submitHandler}
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
            setCartItems={setCartItems}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            isLoadingAdd={isLoadingAdd}
          />
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
