import React from 'react'
import Image from 'next/image'
import image1 from '../../images/featuredProducts/image1.webp'
import image2 from '../../images/featuredProducts/image2.webp'
import image4 from '../../images/featuredProducts/image4.webp'

const FeaturedProducts = () => {
  const products = [
    {
      _id: 1,
      name: 'Cotton Gauze Roll',
      image: image1,
    },
    {
      _id: 2,
      name: 'Vasalin Gauze',
      image: image2,
    },
    {
      _id: 4,
      name: 'First Aid Plaster',
      image: image4,
    },
  ]
  return (
    <>
      <div className='text-center mb-3'>
        <span className=' display-6 border border-success border-start-0 border-end-0'>
          Home Care
        </span>
      </div>
      <div className='row g-3'>
        {products.map((product) => (
          <div key={product._id} className=' col-md-4 col-6'>
            <div className='card'>
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={260}
                className='card-img-top'
              />

              <div className='card-body text-center'>
                <p className='card-text'>{product.name} </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default FeaturedProducts
