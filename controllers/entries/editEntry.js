const path = require("path");
const sharp = require("sharp");
const { createPathIfNotExists, generateError } = require("../../helpers");
const {
  updateEntryById,
  selectEntryById,
} = require("../../repositories/entries");
const { nanoid } = require("nanoid");

const editEntry = async (req, res, next) => {
  try {
    const { idEntry } = req.params;

    const entryDB = await selectEntryById(idEntry);

    if (!entryDB) {
      throw generateError("Entry does not exist", 404);
    }

    const userRole = req.auth.role;

    if (userRole !== "admin") {
      throw generateError("Only admin users can edit entries", 400);
    }
    let imageFileName = entryDB.photo; //Carga la photo que hay en el back y luego si recibe del front otra foto, hace lo de abajo
    if (req.files && req.files.image) {
      //Creo el path del directorio uploads

      const uploadsDir = path.join(__dirname, `../../uploads`);
      await createPathIfNotExists(uploadsDir);

      const image = sharp(req.files.image.data);
      image.resize(1000);
      //guardo la imagen con un nombre aleatorio en el directorio uploads
      imageFileName = `${nanoid(24)}.jpg`;
      await image.toFile(path.join(uploadsDir, imageFileName));
    }
    await updateEntryById({ ...entryDB, ...req.body, photo: imageFileName });

    res.status(200).send({ status: "ok", message: "Entry updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = editEntry;
