const fs = require("fs/promises");

const createPathIfNotExists = async (path) => {
  console.log("entra create path");
  try {
    await fs.access(path);
    console.log("entra try");
  } catch {
    await fs.mkdir(path);
    console.log("entra catch");
  }
};

module.exports = createPathIfNotExists;
