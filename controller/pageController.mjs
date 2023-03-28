import Photo from "../modals/Photo.mjs";

const getAbout = (req, res) => {
  res.render("about");
};

const getAdd = (req, res) => {
    res.render("add");
  }

const getEdit = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  res.render("edit", {
    photo,
  });
}
export { getAbout,getAdd,getEdit };
