import Link from 'next/link';
// Dentro del componente la peticion no debo preocuparme por el dominio,fuera del componente o de un hook si que debo
// cualquier cosas que devuelva LandingPage.getInitialProps lo pasa a este componente como props IMPORTANTE!!
// axios.get('/api/users/currentuser'); peticion desde el browser
const LandingPage = ({ currentUser,tickets }) => {

  const ticketList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link 
          href="/tickets/[ticketId]" 
          as={`/tickets/${ticket.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ))
  
  return (
    <div className="container mt-4">
      <h1>Tickets</h1>
      <table className="table table-striped table-hover table-dark">
        <thead>
          <tr>
            <th>Title</th> 
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  )
};

// esta fuera del componente asi que debo tener cuidado con el dominio de la peticion.
// recuerda que getInitialProps es una funcion que se ejecuta antes de renderizar el componente y sirve para hacer peticiones http.Lo que devuelva aqui lo recibiré como props en este componente
LandingPage.getInitialProps = async (context,client,currentUser) => {
  const response = await client.get('/api/tickets');
  return { 
    tickets: response.data 
  };
};

export default LandingPage;
