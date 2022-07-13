const getPool = require("../../database/getPool");

//Busca en la tabla users un usuario con ese registrationCode, si lo encuentra devuelve true y el controllers/users/registerUser.js continuará para borrarle el código y activar el user. Sino lo encuentra devolverá false y eso significa que ya está activado o que no ha encontrado al usuario porque no existe.

const selectUserByActivationCode = async (registrationCode) => {
  const pool = getPool();

  const [[user]] = await pool.query(
    "SELECT * FROM users WHERE registrationCode = ?",
    [registrationCode]
  );

  return user;
};

module.exports = selectUserByActivationCode;
