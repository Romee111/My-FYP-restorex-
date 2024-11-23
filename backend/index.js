import express from "express";
import { dbConnection } from "./Database/dbConnection.js";
import { bootstrap } from "./src/bootstrap.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { File } from "formdata-polyfill/esm.min.js";
// import { File } from "web3.storage";
// import { File } from  "file-api"
import { PinataSDK } from "pinata-web3";
import multer from "multer";
import {
  allowedTo,
  protectedRoutes,
} from "./src/modules/auth/auth.controller.js";

dotenv.config();
const app = express();
app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const port = 3000;

// Pinata SDK setup
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
});

// Webhook and other middlewares
app.post("/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(morgan("dev"));

// Upload endpoint to pin files to Pinata
// app.post(
//   "/pinata-upload",
//   protectedRoutes,
//   allowedTo("admin", "seller"),
//   upload.single("file"),
//   async (req, res) => {
//     if (!req.body || req.body.length === 0) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     try {
//       const fileBuffer = req.file.buffer;
//       const fileName = req.file.originalname;

//       // Create a file from the blob
//       const file = new File([fileBuffer], fileName, {
//         type: "application/octet-stream",
//       });

//       // Upload the file to Pinata using the Pinata SDK
//       const uploadResponse = await pinata.upload.file(file);

//       const fileUrl = `https://gateway.pinata.cloud/ipfs/${uploadResponse.IpfsHash}`;

//       res.json({
//         fileUrl,
//         IpfsHash: uploadResponse.IpfsHash,
//       });
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       res.status(500).json({ error: "Failed to upload file to Pinata" });
//     }
//   }
// );
app.post(
  "/pinata-upload",
  protectedRoutes,
  allowedTo("admin", "seller"),
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;

      // Create a polyfilled File object
      const file = new File([fileBuffer], fileName, {
        type: "application/octet-stream",
      });

      // Upload the file to Pinata
      const uploadResponse = await pinata.upload.file(file);

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${uploadResponse.IpfsHash}`;

      res.json({
        fileUrl,
        IpfsHash: uploadResponse.IpfsHash,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file to Pinata" });
    }
  }
);



// Bootstrap, Database Connection and Server Listening
bootstrap(app);
dbConnection();

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}!`);
});
