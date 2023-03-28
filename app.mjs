import express from "express";
import mongoose from "mongoose";
import path from "path";
import Photo from "./modals/Photo.mjs";
import fs from "fs";
import fileUpload from "express-fileupload";
import methodOverride from "method-override";
import {
  getPhoto,
  postPhoto,
  getAllPhotos,
  updatePhoto,
  deletePhoto
} from "./controller/photoController.mjs";

import { getAbout,getAdd, getEdit } from "./controller/pageController.mjs";
const app = express();

//db connection

mongoose.connect("mongodb://localhost/pcat-test-db");

//template engine

app.set("view engine", "ejs");

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
app.use(express.static("public"));

//ROUTES

app.get("/", getAllPhotos);
app.get("/photos/:id", getPhoto);
app.post("/photos", postPhoto);
app.put("/photos/:id", updatePhoto);
app.delete("/photos/:id", deletePhoto);
app.get("/about",getAbout);
app.get("/add",getAdd );
app.get("/photos/edit/:id",getEdit );






const port = 3000;

app.listen(port, () => {
  console.log(`server is up on port : ${port}`);
});
