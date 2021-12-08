import axios from "axios";

const  presetingAxios = ( { req } ) => {
   if(typeof window === 'undefined') {
      // We are on the server

      return axios.create({
         /* forma para local */
         // baseURL:'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      /* forma para remoto       */
        baseURL: "http://www.ticketing-k8s-prod.tk",
        headers: req.headers,
      });
   } else {
      // We must be on the browser
      return axios.create({
         baseURL:'/'
      })
   }
};

export default presetingAxios;


/*

// esta fuera del componente asi que debo tener cuidado con el dominio de la peticion.
 LandingPage.getInitialProps = async ( {req}) => {
  // console.log(req.headers)
  if(typeof window === 'undefined'){
    //estamos en el server
    // luego tengo que especificar el dominio al completo
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',{
        // headers: { Host: 'ticketing.dev' }
        headers: req.headers
      })
      return data;

  }else {
    //si existe el objeto window es que estoy en el browser!
    //peticiones no necesitan el dominio
    const { data } = await axios.get('/api/users/currentuser');
    // {currentUser:{}}
    return data;
  }
   
  return {}
} 

*/