import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler,NotFoundError,currentUser } from "@oscargmk8s/common/build";

// import para rutas
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index"
import { updateTicketRouter } from "./routes/update";

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// No confundir mi error con el default de nginx
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };