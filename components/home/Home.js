import React from 'react'
import FeaturedProducts from './FeaturedProducts'
import HotSaleProducts from './HotSaleProducts'
import Carousel from './Carousel'
import Footer from './Footer'
const HomePage = () => {
  return (
    <>
      <Carousel />
      <div className='container py-3'>
        <FeaturedProducts />
        <HotSaleProducts />
      </div>
      <Footer />
    </>
  )
}

export default HomePage
