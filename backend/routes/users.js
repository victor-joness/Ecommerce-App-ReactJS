const { User } = require("../models/user");

const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const bcript = require("bcrypt");

const router = require("express").Router();

//GET ALL USERS
router.get("/", isAdmin, async (req, res) => {
    try {
      const users = await User.find().sort({_id:-1});
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
    }
});

//GET ONE USER
router.get("/find/:id",isAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).send({
        _id:user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.log(error);
    }
});

//DELETE USER
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).send(deletedUser);
  } catch (error) {
    console.log(error);
  }
});

//UPDATE USER
router.put("/:id", isUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if(!(user.email === req.body.email)){
      const emailInUse = await User.findOne({email: req.body.email});
      if(emailInUse) return res.status(400).send("esse email já está sendo usado")
    }

    if(req.body.password && user){
      const salt = await bcript.genSalt(10);
      const hashedPassword = await bcript.hash(req.body.password, salt);

      user.password = hashedPassword
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      isAdmin: req.body.isAdmin,
      password: user.password
    }, {new: true});

    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } catch (error) {
    res.status(500).send(error)
  }
});


//GET USER STATS / somente admin pode
router.get("/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("DD-MM-YYYY HH-mm-ss");

  //aqui é uma operação no banco de dados de agregação, aqui a gente consegue ver quantos usuarios foram criados no mesmo mes, e ele me retorna isso
  //por exemplo no mes id=1 tivemos 4 criação e no mes id=2 tivemos 8, logo no mes id=2 tivemos 100%+ de contas
  //mes 1 = id 1 , mes 2 = id 2
  try {
    const users = await User.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: { month: { $month: "$createdAt" } },
      },
      {
        $group: { _id: "$month", totals: { $sum: 1 } },
      },
    ]);

    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
