const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { selectUserByEmail } = require("../../repositories/users");
const { generateError } = require("../../helpers");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await selectUserByEmail(email);

    // Compruebo que las contraseñas coinciden
    const validPassword = await bcrypt.compare(password, user?.password);

    if (!validPassword) {
      throw generateError("Password does not match", 401);
    }

    if (user.registrationCode) {
      throw generateError("User not activated. Check your email", 400);
    }

    const tokenPayload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).send({ status: "ok", data: { token } });
  } catch (error) {
    next(error);
  }
};

module.exports = loginUser;
