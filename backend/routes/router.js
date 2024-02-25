//router.js
const express = require("express");
const router = express.Router();
const models = require("./../utils/models");

// Api Routes
router.use("/jokes", require("./base.crud")(models.Joke));


module.exports = router;