import buildClient from '../api/build-client';

// Dentro del componente la peticion no debo preocuparme por el dominio,fuera del componente o de un hook si que debo
// cualquier cosas que devuelva LandingPage.getInitialProps lo pasa a este componente como props IMPORTANTE!!
const LandingPage = ( { currentUser } ) => {
  // axios.get('/api/users/currentuser'); peticion desde el browser

  return currentUser 
    ? <h1>You are signed In</h1>
    : <h1>Your are NOT signed In</h1>
  
};


// esta fuera del componente asi que debo tener cuidado con el dominio de la peticion.
 LandingPage.getInitialProps = async ( context ) => {
   console.log('LANDING PAGE!!!')
  const client = buildClient( context );
  const response = await client.get('/api/users/currentuser');
  return response.data;
} 

export default LandingPage;
