import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { ProductList, Category, Cart } from '../components/products'
import { useState } from 'react'
import { products, categories } from '../components/products/boilerplate-seeds'

function Home() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(1)
  const [cartItems, setCartItems] = useState([])

  const filtered_Products = products.filter((p) =>
    p.item.toLowerCase().includes(search && search.toLowerCase())
  )
  const cart = (product) => {
    setCartItems([product])
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
          <Cart cartItems={cartItems} />
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
