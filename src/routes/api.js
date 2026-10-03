const express = require("express");
const router = express.Router();
const musicController = require("../controllers/musicController");

router.post("/generate-lyrics", musicController.generateLyrics);
router.post("/generate-audio", musicController.generateAudio);
router.post("/generate-video", musicController.generateVideo);

module.exports = router;
