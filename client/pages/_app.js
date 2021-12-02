import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/Header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // console.log(Object.keys(appContext));
  // console.log(appContext);

  // Esto va para este componente,pero abasteceré a todos
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  // llamada para cada hijo que implemente getInitialProps,desde aqui le paso client y data.currentUser a cada uno
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser);
  }

  console.log(pageProps,'pageProps');

    return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
