require("dotenv").config();
// require("newrelic");
const http = require("http");
const port = process.env.PORT || 3001;
const compression = require("compression");
const express = require("express");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const morgan = require("morgan");
const cluster = require("express-cluster");
const env = process.env.NODE_ENV || "development";
const errorHandler = require("./api/errors/handlers");
const db = require("./api/models");

//CORS
const corsOptions = {
  exposedHeaders: "Authorization",
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  next();
});

//Routes
const apiroutes = require("./api/routes/index");

app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Serve Static File Directory
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/demo-10.html");
  console.log("home route hit");
});

//Serve Static Terms & Condition Page
app.get("/terms", function (req, res) {
  res.sendFile(__dirname + "/terms.html");
});

//Serve Static Privacy Policy Page
app.get("/privacy", function (req, res) {
  res.sendFile(__dirname + "/privacy.html");
});

app.use(morgan("dev"));

app.use("/api/", apiroutes);

//error hander
app.use((req, res, next) => {
  req.errorHandler = errorHandler;
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get(env) === "development" ? err : {};

  // log.error("ERROR", 500, err);

  // render the error page
  res.status(err.status || 500);
  res.send("ERROR - TRY AGAIN");
});

//DATABASE CONFIGURATION

  db.sequelize.sync({ force: false, logging: false })
  .then(function () {
    db.sequelize
    .authenticate()
    .then(() => {
      console.log('Database Connection has been successfully made to DB:', db.sequelize.config.database);
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

// we're connected!

//SERVER START WITH CLUSTERS - WORKERS USING ALL PROCESSING CPU THREADS - Make Sure to turn off clustering when sycning database, otherwise sequilze with throw errors
// cluster(function() {
server.listen(port, function () {
  // log.info('Express server listening on port ', server.address().port, " with pid ", process.pid );
  console.log(
    "Express server listening on port ",
    server.address().port,
    " with pid ",
    process.pid
  );
});
// });
