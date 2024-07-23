import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import { useDeleteOrderMutation, useGetOrdersQuery } from '../hooks/orderHooks'
import { useContext } from 'react'
import { Store } from '../Store'

export default function OrderListPage() {
  const navigate = useNavigate()
  const { state: { mode }, dispatch } = useContext(Store)

  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery()

  const { mutateAsync: deleteOrder, isLoading: loadingDelete } = useDeleteOrderMutation()

  // Sort orders to have not delivered ones first
  const sortedOrders = orders?.slice().sort((a, b) => {
    if (!a.isDelivered && b.isDelivered) {
      return -1;
    } else if (a.isDelivered && !b.isDelivered) {
      return 1;
    } else {
      return 0;
    }
  });

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await deleteOrder(id);
        refetch();
        toast.success('Order deleted successfully');
      } catch (err) {
        toast.error(getError(err as ApiError));
      }
    }
  }

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
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
                <td>{order.user ? order.user.name : 'DELETED USER'}</td>
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
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant={mode === "light" ? "dark" : "light"}
                    onClick={() => deleteHandler(order._id)}
                  >
                    Delete
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
