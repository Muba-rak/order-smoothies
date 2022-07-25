const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRouter = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const  {requireAuth, checkUser}  = require("./middleware/authMiddleware");
//require("./db/connect");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());


// database connection
const db_url = "mongodb://localhost:27017/ANOTHERDB";
//const dbURI ="mongodb+srv://shaun:test1234@cluster0.del96.mongodb.net/node-auth";

mongoose
  .connect(db_url)
  .then((result) =>
    app.listen(3000, () => {
      console.log("listen and connect");
    })
  )
  .catch((err) => console.log(err));

app.get("*", checkUser);
app.use(authRouter);

// app.get("/set-cookies", (req, res) => {
//   //res.setHeader("Set-Cookie", "newUser=true");
//   res.cookie("newUser", false);
//   res.cookie("isStaff", false, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

//   res.send("you got the cookie");
// });
// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   //console.log(cookies);
//   //console.log(cookies.isStaff);
//   res.json(cookies);
// });

// config - view Engine
app.set("view engine", "ejs");

// routes


