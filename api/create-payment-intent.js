const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app" // Replace with your actual frontend URL
];

module.exports = async (req, res) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};
