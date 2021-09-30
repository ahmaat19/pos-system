import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'

const Customers = () => {
  const menus = [
    {
      name: 'Customer Balance',
      path: 'customer-balance',
    },
  ]
  return (
    <div className='row g-1 mb-2'>
      <Head>
        <title>Customers Report</title>
        <meta property='og:title' content='Customers Report' key='title' />
      </Head>

      {menus.map((menu) => (
        <div key={menu.path} className='col-lg-3 col-md-4 col-6'>
          <Link href={`/report/customer/${menu.path}`}>
            <a className={`btn btn-light form-control `}>{menu.name}</a>
          </Link>
        </div>
      ))}
    </div>
  )
}
export default dynamic(() => Promise.resolve(withAuth(Customers)), {
  ssr: false,
})
