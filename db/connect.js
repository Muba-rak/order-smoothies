const mongoose = require("mongoose");
const db_url = "mongodb://localhost:27017/Tasks-Manager";

mongoose
  .connect(db_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("db working");
  })
  .catch((err) => {
    console.log(err);
  });
