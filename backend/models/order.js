const { string } = require("joi");
const mongoose = require("mongoose");

//criando como vai ser o tipo de tabela
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    customerId: { type: String},
    paymentIntentId: {type: String},
    products: [],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

//criando a tabela com o seu nome e tipo
const Order = mongoose.model("Order", orderSchema);

exports.Order = Order;