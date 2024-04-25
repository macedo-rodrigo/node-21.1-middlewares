const express = require("express");
const { userRouter } = require("./routes/user.routes.js");
const { carRouter } = require("./routes/car.routes.js");
const { brandRouter } = require("./routes/brand.routes.js");
const cors = require("cors"); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

const main = async () => {
  // BBDD connection
  const { connect } = require("./db.js");
  const database = await connect();

  // app confi (previously called "server")
  const PORT = 3000;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: "http://localhost:3000", // This is now a valid port to make calls to this app!
    })
  );

  // Middlewares
  app.use((req, res, next) => {
    // as there is no routem that counts for all requests
    const date = new Date();
    console.log(`This a ${req.method} request to the URl ${req.originalUrl} at ${date}`);
    next();
  });

  // Routes
  const router = express.Router(); // That allows us to use the routes
  router.get("/", (req, res) => {
    res.send(`Esta es la home de nuestra API. Estamos utilizando la BBDD de ${database.connection.name} `);
  });
  router.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  // Our routes
  app.use("/user", userRouter);
  app.use("/car", carRouter);
  app.use("/brand", brandRouter);
  app.use("/", router);

  // this one is to manage errors (the catch part of all routes)
  app.use((err, req, res, next) => {
    console.log("***** ERROR  *****");
    console.log(`This ${req.method} request to the URl ${req.originalUrl} has failed`);
    console.log(err);
    console.log("***** FIN DEL ERROR  *****");

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else {
      next(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`app levantado en el puerto ${PORT}`);
  });
};

main();
