import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler,NotFoundError,currentUser } from "@oscargmk8s/common/build";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

// import para rutas

//  Initalizations
const app = express();

// ---- MIDDLEWARES
// habilitar que le hagan proxy a express
app.set('trust proxy',true);
app.use(json()); 
// poner secure a true cuando este en HTTPS 
// el set up de la cookie va antes de los demas middlewares como por ejemplo currentUser
app.use(
  cookieSession({
    signed:false,
    // secure = true == only https,
    //secure = false == http | https (both)
    //secure: true, 
    secure:process.env.NODE_ENV !== 'test'
  })
)

// MIddlewares co-dependientes de los de arriba 
app.use(currentUser)

// Middlewares para Endpoints
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

// No confundir mi error con el default de nginx
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };