import express from "express";
import mongoose from "mongoose";
import path from "path";
import Photo from "./modals/Photo.mjs";

const app = express();

//db connection

mongoose.connect("mongodb://localhost/pcat-test-db");

//template engine

app.set("view engine", "ejs");

const __dirname = path.resolve();

//MIDDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ROUTES
app.get("/", async (req, res) => {
  const photos = await Photo.find({});

  res.render("index", {
    photos: photos,
  });
});

app.use(express.static("public"));

app.get("/about", (req, res) => {
  res.render("about");
});

app.use(express.static("public"));

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/photos", async (req, res) => {
  await Photo.create(req.body);
  console.log(req.body);
  res.redirect("/");
});

const port = 3000;

app.listen(port, () => {
  console.log(`server is up on port : ${port}`);
});
