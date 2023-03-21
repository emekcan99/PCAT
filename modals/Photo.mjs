import mongoose from "mongoose";

const Schema = mongoose.Schema;

//creating a schema

const photoSchema = new Schema({
  title: String,
  description: String,
  image: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;
