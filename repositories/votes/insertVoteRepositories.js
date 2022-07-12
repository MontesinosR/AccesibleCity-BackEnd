const getPool = require("../../database/getPool");

const insertVoteRepositories = async ({ userId, entryId }) => {
  const pool = getPool();

  const [{ insertId }] = await pool.query(
    "INSERT INTO votes ( entry_id, user_id) VALUES (?, ?)",
    [entryId, userId]
  );

  return insertId;
};

module.exports = insertVoteRepositories;
