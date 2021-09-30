import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'

const SalesUser = () => {
  return (
    <div>
      <Head>
        <title>Sales by user summary report</title>
        <meta
          property='og:title'
          content='Sales by user summary report'
          key='title'
        />
      </Head>{' '}
      sales by user summary
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(SalesUser)), {
  ssr: false,
})
