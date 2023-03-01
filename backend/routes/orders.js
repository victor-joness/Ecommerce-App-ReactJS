const { Order } = require("../models/order");

const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

//GET ORDERS

router.get("/", isAdmin, async (req, res) => {
  const query = req.body.new;

  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });

    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//GET USER ORDERS
router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if(req.user._id !== order.userId || !req.user.isAdmin){
      return res.status(403).send('Acesso negado');
    }

    res.status(201).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

//UPDATE ORDER
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updateOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
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
    const orders = await Order.aggregate([
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

    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//GET INCOME STATS / somente admin pode
router.get("/income/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("DD-MM-YYYY HH-mm-ss");

  //aqui é uma operação no banco de dados de agregação, aqui a gente consegue ver quantos usuarios foram criados no mesmo mes, e ele me retorna isso
  //por exemplo no mes id=1 tivemos 4 criação e no mes id=2 tivemos 8, logo no mes id=2 tivemos 100%+ de contas
  //mes 1 = id 1 , mes 2 = id 2
  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: { _id: "$month", totals: { $sum: "$sales" } },
      },
    ]);

    res.status(200).send(income);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//GET 1 week Sales / somente admin pode
router.get("/week-sales", isAdmin, async (req, res) => {
  const last7Days = moment()
    .day(moment().day() - 7)
    .format("DD-MM-YYYY HH-mm-ss");

  //aqui é uma operação no banco de dados de agregação, aqui a gente consegue ver quantos usuarios foram criados no mesmo mes, e ele me retorna isso
  //por exemplo no mes id=1 tivemos 4 criação e no mes id=2 tivemos 8, logo no mes id=2 tivemos 100%+ de contas
  //mes 1 = id 1 , mes 2 = id 2
  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(last7Days) } },
      },
      {
        $project: {
          day: { $dayOfWeek: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: { _id: "$day", totals: { $sum: "$sales" } },
      },
    ]);

    res.status(200).send(income);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
