import { stripe } from "../src/lib/stripe";

async function seedStripe() {
  console.log("Seeding Stripe products...");

  const plans = [
    {
      name: "Plan Starter",
      description: "Hasta 2 técnicos. Ideal para talleres pequeños.",
      amount: 2900, // 29.00 EUR
      metadata: { technicians: "2" },
    },
    {
      name: "Plan Professional",
      description: "Hasta 8 técnicos. Gestión avanzada para talleres en crecimiento.",
      amount: 5900, // 59.00 EUR
      metadata: { technicians: "8" },
    },
    {
      name: "Plan Enterprise",
      description: "Técnicos ilimitados. Potencia total para grandes talleres.",
      amount: 9900, // 99.00 EUR
      metadata: { technicians: "unlimited" },
    },
  ];

  for (const plan of plans) {
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: plan.metadata,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: "eur",
      recurring: { interval: "month" },
    });

    console.log(`Created ${plan.name}: Product ID: ${product.id}, Price ID: ${price.id}`);
  }

  console.log("Stripe seeding complete!");
}

seedStripe().catch(console.error);
