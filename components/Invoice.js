import logo from '../images/logo.png'
import Image from 'next/image'
import moment from 'moment'

const Invoice = ({ cartItems }) => {
  const subTotal = (items) => {
    return (
      items &&
      items.length > 0 &&
      items.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)
    )
  }

  const toDay = new Date()

  return (
    <div className='container font-monospace'>
      <div className='row '>
        <div className='col-4 my-auto text-center'>
          <Image src={logo} priority width='67' height='90' alt='logo' />
        </div>
        <div className='col-4 my-auto text-center'>
          <label className='fw-bold'>Ligo General Medical Supplies</label>
          <label className=' text-primary'>
            Bakaaro, Holwadaag, Mogdishu, Somalia
          </label>
          <address>
            <label className=''>Tell: 615945558/615424965</label>
            <label className=''>Email: ligo.m.e.p@gmail.com</label>
          </address>
        </div>
        <div className='col-4 my-auto text-center'>
          <label>
            Seller:{' '}
            <span className='text-uppercase'>
              {cartItems && cartItems.customer && cartItems.customer.name}
            </span>
          </label>
          <address>
            <label>Tell: 615945558</label>
          </address>
        </div>
      </div>
      <hr />
      <div className=' mx-auto text-end '>
        <label>Date: {moment(toDay).format('MMM Do YY')}</label> <br />
        <label>Invoice #: {cartItems && cartItems._id}</label>
      </div>

      <h4 className='text-center'>INVOICE</h4>

      <table className='table table-striped table-hover table-sm'>
        <thead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>ITEM</th>
            <th scope='col'>QUANTITY</th>
            <th scope='col'>PRICE</th>
            <th scope='col'>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.orderItems &&
            cartItems.orderItems.length > 0 &&
            cartItems.orderItems.map((item, index) => (
              <tr key={item._id}>
                <th scope='row'>{index + 1}</th>
                <td>{item.name}</td>
                <td>
                  {item.qty} {item.unit}
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>$ {(Number(item.price) * Number(item.qty)).toFixed(2)}</td>
              </tr>
            ))}
        </tbody>
        <tfoot className='table table-borderless'>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>Subtotal</td>
            <td>$ {Number(subTotal(cartItems && cartItems.orderItems))}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>Discount</td>
            <td>${cartItems && cartItems.discount.toFixed(2)}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>Due</td>
            <td className='text-danger'>
              $
              {(
                Number(subTotal(cartItems && cartItems.orderItems)) -
                Number(cartItems.discount) -
                Number(cartItems.paidAmount)
              ).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
      <div className='text-center'>
        <label className='text-center'>
          Signature:
          <span className='text-decoration-underline'>
            {cartItems && cartItems.createdBy && cartItems.createdBy.name}
          </span>
        </label>
      </div>
    </div>
  )
}

export default Invoice
