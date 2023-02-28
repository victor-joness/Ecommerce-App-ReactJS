const express = require("express");
const app = express();
const Stripe = require("stripe");
const { Order } = require("../models/order");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

//fazendo o post no endpoint da api
router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.img.url],
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["BR"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 60,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 30,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    allow_promotion_codes: true,
    line_items,
    mode: "payment",
    customer: customer.id,
    invoice_creation: { enabled: true },
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({ url: session.url });
});

//create order / mandando para o banco de dados
const createOrder = async (customer, data, lineItems) => {
  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: lineItems.data,
    subtotal:data.amount_subtotal,
    total:data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status
  });

  try { 
    //.save é pra mandar pro banco de dados, tipo o insert
    const SavedOrder = await newOrder.save();
    console.log("Order Processada", SavedOrder);
  } catch (error) {
    console.log(error);
  }
};

//stripe webHook para pegar os dados dos pedidos/clients

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
/* endpointSecret = "whsec_0da5a209b6aa546df189f6dbd720ece7e2e2965f3f8ab1a42c12f4a8d94f7fdc"; */

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
        console.log("webhook verification");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = request.body.data.object;
      eventType = request.body.type;
    }

    //handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          stripe.checkout.sessions.listLineItems(
            data.id,
            {},
            function(err, lineItems){
              console.log("line_Items:", lineItems);
              createOrder(customer, data, lineItems);
            }
          )
        })
        .catch((err) => console.log(err));
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
  }
);

module.exports = router;
