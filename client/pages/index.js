
// Dentro del componente la peticion no debo preocuparme por el dominio,fuera del componente o de un hook si que debo
// cualquier cosas que devuelva LandingPage.getInitialProps lo pasa a este componente como props IMPORTANTE!!
const LandingPage = ({ currentUser }) => {
  // axios.get('/api/users/currentuser'); peticion desde el browser

  return currentUser ? (
    <h1>You are signed In</h1>
  ) : (
    <h1>Your are NOT signed In</h1>
  );
};

// esta fuera del componente asi que debo tener cuidado con el dominio de la peticion.
// recuerda que getInitialProps es una funcion que se ejecuta antes de renderizar el componente y sirve para hacer peticiones http.Lo que devuelva aqui lo recibiré como props en este componente
LandingPage.getInitialProps = async (context,client,currentUser) => {
  return {};
};

export default LandingPage;
