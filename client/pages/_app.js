import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from '../components/Header';



const _app = ({ Component, pageProps, currentUser }) => {

  _app.getInitialProps = async (appContext) => {
    // console.log(Object.keys(appContext));
    // console.log(appContext);

    // LLamada para el app.getInitialProps
    const client = buildClient(appContext.ctx)
    const { data } = await client.get('/api/users/currentuser');

    // llamada para el hijo
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    };

    console.log(pageProps)

    return {
      pageProps,
      ...data
    };
  }

  //Componente
  return (
    <div>
      <Header currentUser={ currentUser} /> 
      <Component {...pageProps} />
    </div>
  )
}
  export default _app;
