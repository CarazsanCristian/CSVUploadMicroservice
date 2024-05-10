import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { ShoppingItem } from "./entities/shoppingItem";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [ShoppingItem],
  logging: true,
  synchronize: true,
});
