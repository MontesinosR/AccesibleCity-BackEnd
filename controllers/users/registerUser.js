const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { insertUser, selectUserByEmail } = require("../../repositories/users");
const { generateError } = require("../../helpers");
const { sendMail } = require("../../helpers");
const { newUserSchema } = require("../../schemas/users");

const registerUser = async (req, res, next) => {
  try {
    //--------------------------------------------
    //validaciones
    await newUserSchema.validateAsync(req.body);
    //-------------------------------------------

    const { email, password, name } = req.body;
    //recoge parametros del body

    const userWithSameEmail = await selectUserByEmail(email);
    //busca usuario con el mismo email

    if (userWithSameEmail) {
      throw generateError("Already exists an user with that email", 400);
      //lanza error si existe el usuario
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    //cifra contraseña

    const registrationCode = uuidv4();
    //genera codigo random de activacion de usuario

    const insertId = await insertUser({
      email,
      encryptedPassword,
      name,
      registrationCode,
    });
    //pasa los parámetros a insertar a insertId

    const { SERVER_HOST, SERVER_PORT } = process.env;
    //desctructuring de process.env

    await sendMail(
      "Welcome to AccesibleCity App, please confirm your registration",
      `
      <a href="http://localhost:${SERVER_PORT}/users/activate/${registrationCode}">Click here to activate your account: </a> 
      `,
      email
    );
    //mensaje de bienvenida usando el serverhost y etc que hemos sacado del destructuring de arriba

    res.status(201).send({ status: "ok", data: { id: insertId } });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = registerUser;
