import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./dataSource";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { ShoppingItem } from "./entities/shoppingItem";
var removeBOM = require("remove-bom-stream");
import { validateData } from "./validator/ValidateShoppingItem";
dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();

app.use(bodyParser.json());
app.use(express.json());

let isMonitoring = false;

async function monitorFolder() {
  console.log("check was made");
  if (isMonitoring) {
    return;
  }

  isMonitoring = true;
  const folderPath = path.resolve("uploads");
  const doneFolder = path.resolve("uploads", "done");
  const errorFolder = path.resolve("uploads", "error");

  fs.readdir(folderPath, async (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
    }

    for (const file of files) {
      if (file.endsWith(".csv")) {
        const filePath = `${folderPath}/${file}`;
        const stream = fs
          .createReadStream(filePath)
          .pipe(removeBOM("utf-8"))
          .pipe(csv());

        const products: any[] = [];

        stream.on("data", (data: any) => {
          products.push(data);
        });

        stream.on("end", async () => {
          try {
            const entries = products.map((shoppingItem: any) => {
              const reskeys = Object.keys(shoppingItem);
              const newRow = new ShoppingItem();
              if (!validateData(shoppingItem)) {
                console.log(shoppingItem);
                throw new Error("bad format");
              }

              newRow.productName = shoppingItem[reskeys[0]];
              newRow.category = shoppingItem[reskeys[1]];
              newRow.quantity = shoppingItem[reskeys[2]];
              newRow.price = shoppingItem[reskeys[3]];

              return newRow;
            }, []);

            AppDataSource.manager.save(entries);

            fs.rename(filePath, `${doneFolder}/${file}`, (err) => {
              if (err) {
                console.error("Error moving file to done folder:", err);
              }
            });
          } catch (error) {
            console.error("Error inserting data into database:", error);

            fs.rename(filePath, `${errorFolder}/${file}`, (err) => {
              if (err) {
                console.error("Error moving file to error folder:", err);
              }
            });
          }
        });
      }
    }
  });
  isMonitoring = false;
}

monitorFolder();

setInterval(monitorFolder, 5000);

export default app;
