const bcript = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const { User } = require("../models/user");
const genAuthToken = require("../utils/genAuthToken");

const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(200).required().email(),
    senha: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).send("User já Existe");
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    senha: req.body.senha,
  });

  const salt = await bcript.genSalt(10);
  user.senha = await bcript.hash(user.senha, salt);

  user = await user.save();

  const token = genAuthToken(user);

  res.send(token)
});

module.exports = router;
