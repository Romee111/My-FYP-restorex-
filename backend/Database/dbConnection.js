import mongoose from "mongoose";

export function dbConnection() {
  mongoose
    // .connect(`mongodb+srv://toygamer201:Clustor201@cluster0.zhxde.mongodb.net/e-commerceApp`)
    .connect(
      `mongodb://toygamer201:Clustor201@cluster0-shard-00-00.zhxde.mongodb.net:27017,cluster0-shard-00-01.zhxde.mongodb.net:27017,cluster0-shard-00-02.zhxde.mongodb.net:27017/e-commerceApp?ssl=true&replicaSet=atlas-u2khf7-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`
    )

    .then(() => {
      console.log("DB Connected Succesfully");
    })
    .catch((error) => {
      console.log("DB Failed to connect", error);
    });
}

//Use this is postman https://ecommerce-backend-codv.onrender.com/api/v1/auth/signup
