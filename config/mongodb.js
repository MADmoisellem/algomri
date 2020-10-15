const mongoose = require("mongoose");

try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  
  mongoose.connection.on("error", () => {
    console.error("NAY : database connection failed !!!");
  });
  
  mongoose.connection.on("connected", () => {
    console.log("YAY : Database connected !!!");
    console.log("clik here to acces the website =>", `http://localhost:${process.env.PORT}`);
    
  });
} catch (error) {
  console.log(error);
  
}