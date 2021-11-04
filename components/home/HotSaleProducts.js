import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import image1 from '../../images/hotSaleProduct/image1.jpeg'
import image2 from '../../images/hotSaleProduct/image2.jpeg'
import image3 from '../../images/hotSaleProduct/image3.jpeg'
import image4 from '../../images/hotSaleProduct/image4.jpeg'
import image5 from '../../images/hotSaleProduct/image5.jpeg'
import image7 from '../../images/hotSaleProduct/image7.webp'
import image8 from '../../images/hotSaleProduct/image8.webp'
import image9 from '../../images/hotSaleProduct/image9.webp'
import image10 from '../../images/hotSaleProduct/image10.webp'
import image11 from '../../images/hotSaleProduct/image11.webp'

import image12 from '../../images/hotSaleProduct/image12.webp'
import image13 from '../../images/hotSaleProduct/image13.webp'
import image14 from '../../images/hotSaleProduct/image14.webp'
import image15 from '../../images/hotSaleProduct/image15.webp'
import image16 from '../../images/hotSaleProduct/image16.webp'
import image17 from '../../images/hotSaleProduct/image17.webp'

const HotSaleProducts = () => {
  const products = [
    {
      _id: 1,
      name: 'Perforated adhesive plaster 10cmX5M',
      image: image1,
    },
    {
      _id: 2,
      name: 'Skin Stapler',
      image: image2,
    },
    {
      _id: 3,
      name: 'Epidural Anesthesia Kit',
      image: image3,
    },
    {
      _id: 4,
      name: 'Central Venous Catheter',
      image: image4,
    },
    {
      _id: 5,
      name: 'Crape Paper',
      image: image5,
    },

    {
      _id: 7,
      name: 'Disposal non-woven astro cap',
      image: image7,
    },
    {
      _id: 8,
      name: 'Disposal SMS surgical caps',
      image: image8,
    },
    {
      _id: 9,
      name: 'Disposal CPE/SMS surgical gown sterile / non-sterile',
      image: image9,
    },
    {
      _id: 10,
      name: 'SMS reinforced surgical gown',
      image: image10,
    },
    {
      _id: 11,
      name: 'COVID-19 antigen test cassette (Nasal swap)',
      image: image11,
    },

    {
      _id: 12,
      name: 'One-Step Rapid Test Kit Antigen Schnelltest Laientest Saliva Rapid Test Kit Cassette',
      image: image12,
    },
    {
      _id: 13,
      name: 'High Quality Popular Medical Sterile Disposable Plastic Syringe With Luer lock',
      image: image13,
    },
    {
      _id: 14,
      name: 'Cheap Disposable Orange Cap Insulin Syringe With needle',
      image: image14,
    },
    {
      _id: 15,
      name: 'High Quality Popular Medical Sterile Disposable Plastic Syringe With Luer lock',
      image: image15,
    },
    {
      _id: 16,
      name: 'Factory price medical sterile disposable syringe with needle',
      image: image16,
    },
    {
      _id: 17,
      name: 'URS-10T Urinalysis Reagent Test Paper 10 Parameters Urine Test Strips',
      image: image17,
    },
  ]

  const categories = [
    { _id: 1, name: 'Surgical Dressings' },
    { _id: 2, name: 'Medical Bandage' },
    { _id: 3, name: 'Medical Tape' },
    { _id: 4, name: 'Medical Disposable Instruments' },
    { _id: 5, name: 'Medical Kit and Tray' },
    { _id: 6, name: 'Medical Protective' },
  ]
  return (
    <>
      <div className='text-center mb-3 mt-5'>
        <span className='border border-success border-start-0 border-end-0'>
          Hot Sale Products
        </span>
      </div>
      <div className='row g-3'>
        <div className='col-lg-3 col-12'>
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
        </div>
        <div className='col-lg-9 col-12'>
          <div className='row g-3'>
            {products.map((product) => (
              <div key={product._id} className='col-lg-3 col-md-4 col-6'>
                <div className='card'>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className='card-img-top'
                  />

                  <div className='card-body text-center'>
                    <p className='card-text'>{product.name} </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default HotSaleProducts
