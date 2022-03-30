const router = require("express").Router();
let validateJWT = require("../middleware/validate-session");
let { models } = require("../model");
const RoomModel = require("../model/room");

//! CREATING A ROOM:
router.post("/create", validateJWT, async (req, res) => {
  const { room } = req.body;

  try {
    const createRoom = await RoomModel.create({
      room: room,
      userId: req.user.id,
      houseCode: req.user.houseCode,
    });

    res.status(201).json({
      message: "Room added successfully",
      createRoom,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: `Failed to post`,
    });
  }
});

//! GET ALL ROOMS IN THE CORRESPONDING HOUSE CODE
router.get("/allrooms", validateJWT, async (req, res) => {
  const { houseCode } = req.user;

  try {
    const allRooms = await RoomModel.findAll({
      where: {
        houseCode: houseCode,
      },
      include: [
        {
          model: models.ChoreModel,
        },
      ],
    });

    res.status(200).json(allRooms);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "The server broke but the app is still running",
    });
  }
});

//! GET ALL ROOMS CREATED BY THAT USER
router.get("/myrooms", validateJWT, async (req, res) => {
  let { id } = req.user;

  try {
    const myRooms = await RoomModel.findAll({
      where: {
        userId: id,
      },
      include: [
        {
          model: models.ChoreModel,
        },
      ],
    });

    res.status(200).json(myRooms);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "The server broke but the app is still running",
    });
  }
});

//! GET ROOM BY ROOM_ID
router.get("/target/:roomId", validateJWT, async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const results = await models.RoomModel.findAll({
      where: {
        id: roomId,
      },
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `Failed: ${error}`,
    });
  }
});

//! UPDATE ROOM BY ROOM_ID:
router.put("/:id", validateJWT, async (req, res) => {
  const { room } = req.body;
  const roomId = req.params.id;
  const { id } = req.user;

  const query = {
    where: {
      id: roomId,
      userId: id,
    },
  };

  const updatedRoom = {
    room: room,
  };

  try {
    const update = await RoomModel.update(updatedRoom, query);
    res.status(200).json({ message: "Room has been removed", updatedRoom, update });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//! DELETE ROOM BY ROOM_ID:
router.delete("/:id", validateJWT, async (req, res) => {
  const roomId = req.params.id;
  const { id } = req.user;

  const query = {
    where: {
      id: roomId,
      userId: id,
    },
  };

  try {
    const removeRoom = await RoomModel.destroy(query);
    res.status(200).json({ message: "Room has been removed", removeRoom });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
