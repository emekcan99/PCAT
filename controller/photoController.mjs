import Photo from "../modals/Photo.mjs";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const getPhoto = async (req, res) => {
  //console.log(req.params.id)
  const photo = await Photo.findById(req.params.id);

  res.render("photo", {
    photo,
  });
};

const __dirname = path.resolve();

const postPhoto = async (req, res) => {
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = +__dirname + "/../public/uploads/" + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadImage.name,
    });
    res.redirect("/");
  });
};

const getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photosPerPage = 3;

  const totalPhotos = await Photo.find().countDocuments();

  const photos = await Photo.find({})
    .sort("-dateCreated")
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

    res.render('index',{
      photos: photos,
      current:page,
      pages: Math.ceil(totalPhotos /photosPerPage)
    })

  /*const photos = await Photo.find({}).sort("-dateCreated");
  res.render("index", {
    photos: photos,
  });
*/
};

const updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  photo.title = req.body.title;
  photo.description = req.body.description;

  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

const deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  let deletedImage = __dirname + "/public" + photo.image;

  fs.unlinkSync(deletedImage);

  await Photo.findByIdAndRemove(req.params.id);

  console.log(req.params.id);

  res.redirect("/");
};

export { getPhoto, postPhoto, getAllPhotos, updatePhoto, deletePhoto };
