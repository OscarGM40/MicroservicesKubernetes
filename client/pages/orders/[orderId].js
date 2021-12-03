import { Router } from "next/router";
import { useEffect, useState } from "react";
import  StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push("/orders")
  });


  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    // dado que el interval va a tardar un segundo tengo que llamar yo la primera vez a la función
    findTimeLeft();
    // para limpiar el intervalo hay que asignarlo
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div className="container mt-4">
        <div className="col-6 offset-3 card card-body bg-dark text-white text-center mt-4">
          <h1>Order Expired</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="col-6 offset-3 card card-body bg-light mt-4">
        <h1>OrderShow</h1>
        <p>Time left to pay: {timeLeft} seconds until order expires</p>
        <p>Order total: {order.ticket.price} EUR</p>
        <StripeCheckout
          token={ ({id}) => doRequest({ token: id })}
          stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
          amount={order.ticket.price*100}
          email={currentUser.email}
           />
      </div>
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
