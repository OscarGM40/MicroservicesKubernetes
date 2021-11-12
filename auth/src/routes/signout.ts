import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/signout",(req: Request, res: Response) => {
  req.session=null;
  // si hubiera problemas usar el metodo clearCookie(cookieName)
  // res.clearCookie('express:sess');
  res.send({});
});

export { router as signoutRouter };
