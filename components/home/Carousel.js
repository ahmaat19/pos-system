import Image from 'next/image'
import c1 from '../../images/c1.jpg'
import c2 from '../../images/c2.jpg'

const Carousel = () => {
  return (
    <div
      id='carouselExampleIndicators'
      className='carousel slide'
      data-bs-ride='carousel'
    >
      <div className='carousel-indicators'>
        <button
          type='button'
          data-bs-target='#carouselExampleIndicators'
          data-bs-slide-to='0'
          className='active'
          aria-current='true'
          aria-label='Slide 1'
        ></button>
        <button
          type='button'
          data-bs-target='#carouselExampleIndicators'
          data-bs-slide-to='1'
          aria-label='Slide 2'
        ></button>
      </div>
      <div className='carousel-inner'>
        <div className='carousel-item active'>
          <Image
            src={c1}
            alt='slide'
            width='2000'
            height='700'
            objectFit='cover'
            className='d-block w-100'
          />
        </div>
        <div className='carousel-item'>
          <Image
            src={c2}
            alt='slide'
            width='2000'
            height='700'
            className='d-block w-100'
          />
        </div>
      </div>
      <button
        className='carousel-control-prev'
        type='button'
        data-bs-target='#carouselExampleIndicators'
        data-bs-slide='prev'
      >
        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Previous</span>
      </button>
      <button
        className='carousel-control-next'
        type='button'
        data-bs-target='#carouselExampleIndicators'
        data-bs-slide='next'
      >
        <span className='carousel-control-next-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Next</span>
      </button>
    </div>
  )
}

export default Carousel
