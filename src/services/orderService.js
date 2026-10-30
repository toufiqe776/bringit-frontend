const seedOrders = [
  {
    id: "ORD-1052",
    customer: "Rahul Sharma",
    items: 4,
    amount: 486,
    time: "10:42 AM",
    status: "Delivered",
  },
  {
    id: "ORD-1051",
    customer: "Priya Singh",
    items: 6,
    amount: 728,
    time: "10:39 AM",
    status: "Out for Delivery",
  },
  {
    id: "ORD-1050",
    customer: "Amit Kumar",
    items: 3,
    amount: 249,
    time: "10:31 AM",
    status: "Packing",
  },
];

export async function getOrders() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...seedOrders];
}

export default {
  getOrders,
};
