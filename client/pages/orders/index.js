import Link from "next/link";

const OrderIndex = ({ orders }) => {
  const orderList = orders.map((order) => (
    <tr key={order.id}>
      <td>{order.ticket.title}</td>
      <td>{order.status}</td>
      <td>
        <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
          <a>View Order</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div className="container mt-4">
      <h1>My Orders</h1>
      <table className="table table-striped table-hover table-light">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
