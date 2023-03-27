import express from "express";
import mongoose from "mongoose";
import path from "path";
import Photo from "./modals/Photo.mjs";
import fs from "fs";
import fileUpload from "express-fileupload";
import methodOverride from "method-override";

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
app.use(fileUpload());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//ROUTES
app.get("/", async (req, res) => {
  const photos = await Photo.find({}).sort("-dateCreated");

  res.render("index", {
    photos: photos,
  });
});

app.use(express.static("public"));

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/photos/:id", async (req, res) => {
  //console.log(req.params.id)
  const photo = await Photo.findById(req.params.id);

  res.render("photo", {
    photo,
  });
});

app.use(express.static("public"));

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/photos", async (req, res) => {
  //console.log(req.files.image)
  //console.log(req.body);
  //res.redirect("/");

  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + "/public/uploads/" + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadedImage.name,
    });
    res.redirect("/");
  });
});

app.get("/photos/edit/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  res.render("edit", {
    photo,
  });
});

app.put("/photos/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  photo.title = req.body.title;
  photo.description = req.body.description;

  photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

app.delete("/photos/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  let deletedImage = __dirname + "/public" + photo.image;
  fs.unlinkSync(deletedImage);

  await Photo.findByIdAndRemove(req.params.id);

  console.log(req.params.id);

  res.redirect("/");
});

const port = 3000;

app.listen(port, () => {
  console.log(`server is up on port : ${port}`);
});
