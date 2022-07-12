const {
  insertVoteRepositories,
  selectVoteByUserId,
} = require("../../repositories/votes");
const { generateError } = require("../../helpers");
const { selectEntryById } = require("../../repositories/entries");

const createVote = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    //requiere una id de usuario para ver que está logueado.

    const { entryId } = req.params;
    //recogemos del body los parametros
    const entryDB = await selectEntryById(entryId);
    if (!entryDB) {
      throw generateError("that entry does not exist", 404);
    }
    const voteWithSameUserId = await selectVoteByUserId(userId, entryId);
    //busca usuario con el mismo email

    if (voteWithSameUserId) {
      throw generateError("that entry already has your vote", 400);
    }

    const insertVote = await insertVoteRepositories({
      entryId,
      userId,
    });
    //pasa los parámetros a insertar a insertVote para que se cree un voto con ese usuario y ese entryID, después los
    //agruparemos los votos por numero userid para que se vean el contador de votos.

    res.status(201).send({ status: "ok", data: { insertVote: insertVote } });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = createVote;
