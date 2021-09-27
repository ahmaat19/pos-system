import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { ProductList, Category, Cart } from '../components/products'
import { useState } from 'react'
import { products, categories } from '../components/products/boilerplate-seeds'
import { useForm } from 'react-hook-form'

function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(1)
  const [cartItems, setCartItems] = useState([])
  const [discount, setDiscount] = useState([])

  const filtered_Products = products.filter((p) =>
    p.item.toLowerCase().includes(search && search.toLowerCase())
  )
  const cart = (product) => {
    const { category, image, price, cost, stock, unit, item, _id } = product
    const prevProducts = [...cartItems]
    if (prevProducts.length > 0) {
      const products = prevProducts.filter((p) => p._id === _id)
      if (products.length > 0) {
        setCartItems([
          ...cartItems.filter((p) => p._id !== _id),
          {
            category,
            image,
            price,
            cost,
            stock,
            unit,
            item,
            _id,
            qty: Number(products[0].qty) + 1,
          },
        ])
      } else {
        setCartItems([
          ...prevProducts,
          { category, image, price, cost, stock, unit, item, _id, qty: 1 },
        ])
      }
    } else {
      setCartItems([
        { category, image, price, cost, stock, unit, item, _id, qty: 1 },
      ])
    }
  }

  const submitHandler = async (data) => {
    // mutateAsync(data)
    console.log({ data, cartItems })
  }

  return (
    <div>
      <Head>
        <title>Point Of Sale</title>
        <meta property='og:title' content='Point Of Sale' key='title' />
      </Head>
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
            categories={categories}
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
          />
          <hr />
          <ProductList
            products={filtered_Products}
            activeCategory={activeCategory}
            cart={cart}
          />
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
          />
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
