const router = require("express").Router();
let validateJWT = require("../middleware/validate-session");
const { ChoreModel, RoomModel, models } = require("../model");

//!CREATE A CHORE
router.post("/create", validateJWT, async (req, res) => {
  const { chore, desc, time, roomId } = req.body;

  try {
    const newChore = await models.ChoreModel.create({
      chore: chore,
      desc: desc,
      time: time,
      roomId: roomId,
      userId: req.user.id,
      houseCode: req.user.houseCode,
    });

    res.status(200).json({
      message: "A new chore has been added",
      newChore,
    });
  } catch (error) {
    res.status(500).json({
      error: `Failed to create new chore: ${error}`,
    });
  }
});

//! GET ALL CHORES BY ALL USERS
router.get("/all", validateJWT, async (req, res) => {
  try {
    const allChores = await models.ChoreModel.findAll();

    res.status(200).json(allChores);
  } catch (error) {
    res.status(500).json({
      error: `Failed to get all chores: ${error}`,
    });
  }
});

//! GET CHORE BY ROOM ID
router.get("/:roomId", validateJWT, async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const byRoom = await models.ChoreModel.findAll({
      where: {
        roomId: roomId,
      },
    });

    res.status(200).json(byRoom);
  } catch (error) {
    res.status(500).json({
      error: `Failed to get chore by room id: ${error}`,
    });
  }
});

//! UPDATE CHORE BY CHORE_ID:
router.put("/:id", validateJWT, async (req, res) => {
  const { chore, desc, time, roomId } = req.body;
  const choreId = req.params.id;

  let query;
  if (req.user.admin == true) {
    query = {
      where: {
        id: choreId,
        houseCode: req.user.houseCode,
      },
    };
  } else {
    query = {
      where: {
        id: choreId,
        userId: req.user.id,
      },
    };
  }

  const updatedChore = {
    chore: chore,
    desc: desc,
    time: time,
    roomId: roomId,
    userId: req.user.id,
  };

  try {
    const update = await models.ChoreModel.update(updatedChore, query);
    res.status(200).json({
      message: "This chore has been updated",
      updatedChore,
      update
    });
  } catch (error) {
    res.status(500).json({
      error: `Failed to update that chore ${error}`,
    });
  }
});

//! DELETE A CHORE
router.delete("/:id", validateJWT, async (req, res) => {
  const choreId = req.params.id;
  const { id } = req.user;

  let query;
  if (req.user.admin == true) {
    query = {
      where: {
        id: choreId,
        houseCode: req.user.houseCode,
      },
    };
  } else {
    query = {
      where: {
        id: choreId,
        userId: id,
      },
    };
  }

  try {
    const removeChore = await models.ChoreModel.destroy(query);
    res.status(200).json({ message: "Chore has been removed", removeChore });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
