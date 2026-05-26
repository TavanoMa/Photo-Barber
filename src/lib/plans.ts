export const plans = {
  starter: {
    credits: 80,
    price: 89,
    productId: process.env.ABACATE_STARTER_ID!,
  },

  growth: {
    credits: 200,
    price: 189,
    productId: process.env.ABACATE_GROWTH_ID!,
  },

  scale: {
    credits: 500,
    price: 349,
    productId: process.env.ABACATE_SCALE_ID!,
  },
} as const

export type PlanName = keyof typeof plans