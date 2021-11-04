import React from 'react'
import HomePage from '../components/home/Home'
import Head from 'next/head'

const Home = () => {
  return (
    <>
      <Head>
        <title>Ligo Medical</title>
        <meta property='og:title' content='Ligo Medical' key='title' />
      </Head>

      <HomePage />
    </>
  )
}

export default Home
