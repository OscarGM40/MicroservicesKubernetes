import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { errorHandler,NotFoundError } from "@oscargmk8s/common/build";
import { signupRouter } from "./routes/signup";
/* import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error"; */

// Middlewares & Initalizations
const app = express();
//el tráfico esta siendo redirigido a traves del proxy nginx,por defecto express no va a dejar que le hagan proxy,hay que darle permiso para que el Ingress haga de proxy
app.set('trust proxy',true);

app.use(json()); // tambien valía app.use(express.json());
// securizar a true la cookie significa que sólo va a devolverse/operar con cookies si la peticion es bajo HTTPS(con tests va a fallar pues se usa http) 
app.use(
  cookieSession({
    signed:false,
    secure: false, //true= only https,false= http | https
    // secure:process.env.NODE_ENV !== 'test'
  })
)

// Endpoints
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//Despite the catch-all '*' route, the NotFoundError is only activated on paths that match the ingress-srv service regular expression,  path: /api/users/?(.*) Otherwise,  default nginx 404 behavior is activated.No confundir mi error con el de nginx
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };