const getPool = require("../../database/getPool");

//Esta función se llama desde registerUser.js en la carpeta controllers/users para comprobar que exista un usuario con ese e-mail.

const selectUserByEmail = async (email) => {
  const pool = getPool();

  const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  return user;
};

module.exports = selectUserByEmail;
