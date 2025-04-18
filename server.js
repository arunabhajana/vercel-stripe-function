const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Stripe payment server is live ✅");
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr", 
      automatic_payment_methods: {
        enabled: true, 
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("❌ Stripe Error:", err.message);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
