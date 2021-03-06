import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { getCategories } from '../../api/category'
import { getProducts } from '../../api/product'
import { useQuery } from 'react-query'
import Loader from 'react-loader-spinner'
import Message from '../Message'

const HotSaleProducts = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery('categories', () => getCategories(), {
    retry: 0,
  })

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useQuery('products', () => getProducts(), {
    retry: 0,
  })

  // const products = [
  //   {
  //     _id: 1,
  //     name: 'Perforated adhesive plaster 10cmX5M',
  //     image: image1,
  //   },
  //   {
  //     _id: 2,
  //     name: 'Skin Stapler',
  //     image: image2,
  //   },
  //   {
  //     _id: 3,
  //     name: 'Epidural Anesthesia Kit',
  //     image: image3,
  //   },
  //   {
  //     _id: 4,
  //     name: 'Central Venous Catheter',
  //     image: image4,
  //   },
  //   {
  //     _id: 5,
  //     name: 'Crape Paper',
  //     image: image5,
  //   },

  //   {
  //     _id: 7,
  //     name: 'Disposal non-woven astro cap',
  //     image: image7,
  //   },
  //   {
  //     _id: 8,
  //     name: 'Disposal SMS surgical caps',
  //     image: image8,
  //   },
  //   {
  //     _id: 9,
  //     name: 'Disposal CPE/SMS surgical gown sterile / non-sterile',
  //     image: image9,
  //   },
  //   {
  //     _id: 10,
  //     name: 'SMS reinforced surgical gown',
  //     image: image10,
  //   },
  //   {
  //     _id: 11,
  //     name: 'COVID-19 antigen test cassette (Nasal swap)',
  //     image: image11,
  //   },

  //   {
  //     _id: 12,
  //     name: 'One-Step Rapid Test Kit Antigen Schnelltest Laientest Saliva Rapid Test Kit Cassette',
  //     image: image12,
  //   },
  //   {
  //     _id: 13,
  //     name: 'High Quality Popular Medical Sterile Disposable Plastic Syringe With Luer lock',
  //     image: image13,
  //   },
  //   {
  //     _id: 14,
  //     name: 'Insulin Syringe With needle',
  //     image: image14,
  //   },
  //   {
  //     _id: 15,
  //     name: 'High Quality Popular Medical Sterile Disposable Plastic Syringe With Luer lock',
  //     image: image15,
  //   },
  //   {
  //     _id: 16,
  //     name: 'Medical sterile disposable syringe with needle',
  //     image: image16,
  //   },
  //   {
  //     _id: 17,
  //     name: 'URS-10T Urinalysis Reagent Test Paper 10 Parameters Urine Test Strips',
  //     image: image17,
  //   },
  // ]

  // const categories = [
  //   { _id: 1, name: 'Surgical Dressings' },
  //   { _id: 2, name: 'Medical Bandage' },
  //   { _id: 3, name: 'Medical Tape' },
  //   { _id: 4, name: 'Medical Disposable Instruments' },
  //   { _id: 5, name: 'Medical Kit and Tray' },
  //   { _id: 6, name: 'Medical Protective' },
  // ]
  return (
    <>
      <div className='text-center mb-3 mt-5'>
        <span className='border border-success border-start-0 border-end-0'>
          Hot Sale Products
        </span>
      </div>
      <div className='row g-3'>
        <div className='col-lg-3 col-12'>
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
            <div className='card'>
              <ul className='list-group list-group-flush'>
                {categories.map((category) => (
                  <Link key={category._id} href='/'>
                    <a className='text-decoration-none'>
                      <li className='list-group-item'>{category.name}</li>
                    </a>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className='col-lg-9 col-12'>
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
              {products.map((product) => (
                <div key={product._id} className='col-lg-3 col-md-4 col-6'>
                  <div className='card'>
                    {product.picture && (
                      <Image
                        src={product.picture && product.picture.picturePath}
                        alt={product.picture && product.picture.pictureName}
                        width={200}
                        height={200}
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
        </div>
      </div>
    </>
  )
}

export default HotSaleProducts
