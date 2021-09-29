import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'

const SalesCustomer = () => {
  return (
    <div>
      <Head>
        <title>Sales by customer summary report</title>
        <meta
          property='og:title'
          content='Sales by customer summary report'
          key='title'
        />
      </Head>{' '}
      sales by customer summary
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(SalesCustomer)), {
  ssr: false,
})
