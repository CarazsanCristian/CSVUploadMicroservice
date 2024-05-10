import app from "./app";

const port: number = Number(process.env.PORT) || 3601;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
