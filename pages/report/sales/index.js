import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'

const Sales = () => {
  const menus = [
    {
      name: 'Sales by item summary',
      path: 'sales-by-item-summary',
    },
    {
      name: 'Sales by customer summary',
      path: 'sales-by-customer-summary',
    },
  ]
  return (
    <div className='row g-1 mb-2'>
      <Head>
        <title>Sales Report</title>
        <meta property='og:title' content='Sales Report' key='title' />
      </Head>

      {menus.map((menu) => (
        <div key={menu.path} className='col-lg-3 col-md-4 col-6'>
          <Link href={`/report/sales/${menu.path}`}>
            <a className={`btn btn-light form-control `}>{menu.name}</a>
          </Link>
        </div>
      ))}
    </div>
  )
}
export default dynamic(() => Promise.resolve(withAuth(Sales)), { ssr: false })
