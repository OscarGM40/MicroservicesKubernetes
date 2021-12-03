import useRequest from "../../hooks/use-request";
import Router from "next/router";


const TicketShow = ({ ticket }) => {
  // console.log(ticket)
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push(
      "/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div className="container mt-4 ">
      <div className="col-8 offset-2">
        <div className="card card-body bg-light">
          <h1>{ticket.title}</h1>
          <h4>{ticket.price}</h4>
          {errors}
          <button className="btn btn-primary"
           onClick={() => doRequest()}>
            Purchase This Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const ticket = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: ticket.data };
};

export default TicketShow;
