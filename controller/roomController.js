const router = require('express').Router();
let validateJWT = require('../middleware/validate-session');
const RoomModel = require('../model/room');

//! CREATING A ROOM:
router.post("/create", validateJWT, async (req, res) => {
  const { room } = req.body

  try {
      const createRoom = await RoomModel.create({
         room: room,
         userId: req.user.id
      });


      res.status(201).json({
          message: 'Room added successfully',
          createRoom
      })
  } catch (error) {
    console.log({error})
      res.status(500).json({
          message: `Failed to post`,
        })
        
  }
});


//! GET ALL ROOMS BY ALL USERS
router.get('/allrooms', validateJWT, async (req, res) => {
  try {
      const allRooms = await RoomModel.findAll()

      res.status(200).json(allRooms)

  } catch (err) {

      res.status(500).json({
          error: err,
          message: "The server broke but the app is still running"
      });
  }
});


//! GET ALL ROOMS BY ONE USERS
router.get('/myrooms', validateJWT, async (req, res) => {
  let { id } = req.user;

  try {
      const myRooms = await RoomModel.findAll({
        where: {
          userId: id
        }
      })

      res.status(200).json(myRooms)

  } catch (err) {

      res.status(500).json({
          error: err,
          message: "The server broke but the app is still running"
      });
  }
});


//! UPDATE ROOM BY ID:
router.put('/:id', validateJWT, async (req, res) => {
  const { room } = req.body;
  const roomId = req.params.id;
  const { id } = req.user;

  const query = {
      where: {
          id: roomId,
          userId: id
      }
  };

  const updatedRoom = {
      room: room
  };

  try {
      const update = await RoomModel.update(updatedRoom, query);
      res.status(200).json(updatedRoom);
  } catch (err) {
      res.status(500).json({ error: err });
  }
});



//! DELETE ROOM BY ID:
router.delete('/:id', validateJWT, async (req, res) => {
  const roomId = req.params.id;
  const { id } = req.user;

  const query = {
      where: {
          id: roomId,
          userId: id
      }
  };

  try {
      const update = await RoomModel.destroy(query);
      res.status(200).json({message: 'Room has been removed'});
  } catch (err) {
      res.status(500).json({ error: err });
  }
});

module.exports = router;