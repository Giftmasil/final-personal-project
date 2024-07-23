import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Button from 'react-bootstrap/Button'
import { useGetOrderHistoryQuery } from '../hooks/orderHooks'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import { useContext } from 'react'
import { Store } from '../Store'

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery()
  const { state: {mode}, dispatch } = useContext(Store)

  // Sort orders to have not delivered ones first
  const sortedOrders = orders?.slice().sort((a, b) => {
    if (!a.isDelivered && b.isDelivered) {
      return -1
    } else if (a.isDelivered && !b.isDelivered) {
      return 1
    } else {
      return 0
    }
  })

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders!.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant={mode === "light" ? "dark" : "light"}
                    onClick={() => {
                      navigate(`/order/${order._id}`)
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
