const { insertEntry } = require("../../repositories/entries");
const { createPathIfNotExists } = require("../../helpers");
const path = require("path");
const sharp = require("sharp");
const { nanoid } = require("nanoid");
const { newEntrySchema } = require("../../schemas/entries");

const createEntry = async (req, res, next) => {
  try {
    // const { id: userId } = req.auth;

    const userId = req.auth.id;
    //requiere una id de usuario para ver que está logueado

    //----------------------------------------------
    //validaciones
    await newEntrySchema.validateAsync(req.body);
    //---------------------------------------------

    const { title, description, city, neighborhood, status } = req.body;
    //recogemos del body los parametros

    //-----------------------CODIGO NUEVO PARA IMGANES ------------------------------------------

    //req.files---> .image es el nombre de la KEY que ponemos en el postman
    let imageFileName;
    if (req.files && req.files.image) {
      //Creo el path del directorio uploads
      const uploadsDir = path.join(__dirname, `../../uploads`);
      //Creo el directorio si no existe
      await createPathIfNotExists(uploadsDir);
      //procesar la imagen
      const image = sharp(req.files.image.data);
      image.resize(1000);
      //guardo la imagen con un nombre aleatorio en el directorio uploads
      imageFileName = `${nanoid(24)}.jpg`;
      await image.toFile(path.join(uploadsDir, imageFileName));
    }

    //----------------------------------------------------------------------------
    const insertId = await insertEntry({
      title,
      description,
      imageFileName,
      city,
      neighborhood,
      status,
      userId,
    });
    //pasamos los paramretros a inserentry y lo guardamos en la constante insertId

    res.status(201).send({
      status: "ok",
      data: {
        id: insertId,
        title,
        description,
        photo: imageFileName,
        city,
        neighborhood,
        status,
        userId,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createEntry;
