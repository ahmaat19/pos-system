import React from 'react'
import Image from 'next/image'
import image1 from '../../images/featuredProducts/image1.webp'
import image2 from '../../images/featuredProducts/image2.webp'
import image4 from '../../images/featuredProducts/image4.webp'
import Message from '../Message'
import Loader from 'react-loader-spinner'
import { getProducts } from '../../api/product'
import { useQuery } from 'react-query'

const FeaturedProducts = () => {
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useQuery('products', () => getProducts(), {
    retry: 0,
  })

  // const limitedProducts = products && products.

  // const products = [
  //   {
  //     _id: 1,
  //     name: 'Cotton Gauze Roll',
  //     image: image1,
  //   },
  //   {
  //     _id: 2,
  //     name: 'Vasalin Gauze',
  //     image: image2,
  //   },
  //   {
  //     _id: 4,
  //     name: 'First Aid Plaster',
  //     image: image4,
  //   },
  // ]
  return (
    <>
      <div className='text-center mb-3'>
        <span className=' display-6 border border-success border-start-0 border-end-0'>
          Home Care
        </span>
      </div>
      {isLoadingProducts ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorProducts ? (
        <Message variant='danger'>{errorProducts}</Message>
      ) : (
        <div className='row g-3'>
          {products &&
            products.slice(0, 3).map((product) => (
              <div key={product._id} className=' col-md-4 col-6'>
                <div className='card'>
                  {product.picture && (
                    <Image
                      src={product.picture && product.picture.picturePath}
                      alt={product.picture && product.picture.pictureName}
                      width={100}
                      height={280}
                      className='card-img-top'
                    />
                  )}

                  <div className='card-body text-center'>
                    <p className='card-text'>{product.name} </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  )
}

export default FeaturedProducts
