import React from 'react'

const Footer = () => {
  return (
    <footer className='card-footer text-center mt-5 mb-2'>
      Copyright &copy; {new Date().getFullYear()} Ligo Medical - All Rights
      Reserved
      <p>
        Developed By: <a href='https://websom.dev'>websom.dev</a>
      </p>
      <div id='watermark'></div>
    </footer>
  )
}

export default Footer
