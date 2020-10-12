const mongoose = require("mongoose");

const db = process.env.NODE_ENV === 'production' ? process.env.ATLAS_URI : process.env.MONGO_URI;
const port = process.env.NODE_ENV === 'production' ? process.env.PORT : "8006";



mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", () => {
  console.error("NAY : database connection failed !!!");
});

mongoose.connection.on("connected", () => {
  console.log("YAY : Database connected !!!",'@', db);
  console.log("clik here to acces the website =>", `http://localhost:${port}`);
  
});