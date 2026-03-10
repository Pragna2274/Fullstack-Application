import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {

const foods = [

{
name:"Margherita Pizza",
description:"Classic Italian pizza with tomato sauce and mozzarella.",
price:250,
image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
category:"Pizza"
},

{
name:"Pepperoni Pizza",
description:"Pizza topped with spicy pepperoni and melted cheese.",
price:320,
image:"https://images.unsplash.com/photo-1601924582975-7e0c9e29e9f4",
category:"Pizza"
},

{
name:"Farmhouse Pizza",
description:"Loaded with fresh vegetables and cheese.",
price:300,
image:"https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
category:"Pizza"
},

{
name:"Veg Burger",
description:"Grilled vegetable patty burger with sauce.",
price:150,
image:"https://images.unsplash.com/photo-1550547660-d9450f859349",
category:"Burger"
},

{
name:"Chicken Burger",
description:"Juicy chicken burger with lettuce and cheese.",
price:200,
image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
category:"Burger"
},

{
name:"Double Cheese Burger",
description:"Burger with double cheese and crispy patty.",
price:230,
image:"https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
category:"Burger"
},

{
name:"French Fries",
description:"Crispy golden fries with seasoning.",
price:120,
image:"https://images.unsplash.com/photo-1576107232684-1279f390859f",
category:"Snacks"
},

{
name:"Chicken Nuggets",
description:"Crunchy chicken nuggets with sauce.",
price:180,
image:"https://images.unsplash.com/photo-1604908176997-431f3b66f29d",
category:"Snacks"
},

{
name:"Onion Rings",
description:"Deep fried crispy onion rings.",
price:140,
image:"https://images.unsplash.com/photo-1625944525903-bc3b6c0f3e3d",
category:"Snacks"
},

{
name:"Pasta Alfredo",
description:"Creamy Alfredo pasta with parmesan cheese.",
price:280,
image:"https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5",
category:"Pasta"
},

{
name:"Spaghetti Bolognese",
description:"Italian spaghetti pasta with meat sauce.",
price:290,
image:"https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
category:"Pasta"
},

{
name:"Mac and Cheese",
description:"Classic macaroni pasta with creamy cheese sauce.",
price:260,
image:"https://images.unsplash.com/photo-1543352634-873c0c5d2d8a",
category:"Pasta"
},

{
name:"Grilled Chicken",
description:"Tender grilled chicken served with herbs.",
price:350,
image:"https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
category:"Grill"
},

{
name:"Chicken Steak",
description:"Grilled chicken steak with pepper sauce.",
price:370,
image:"https://images.unsplash.com/photo-1605475128023-9b5e4c58c6df",
category:"Grill"
},

{
name:"Paneer Tikka",
description:"Indian grilled paneer cubes with spices.",
price:270,
image:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
category:"Indian"
},

{
name:"Chicken Biryani",
description:"Traditional basmati rice cooked with chicken.",
price:300,
image:"https://images.unsplash.com/photo-1633945274309-2c16f4d3f1a0",
category:"Indian"
},

{
name:"Veg Biryani",
description:"Flavorful vegetable biryani with spices.",
price:260,
image:"https://images.unsplash.com/photo-1625944525903-bc3b6c0f3e3d",
category:"Indian"
},

{
name:"Butter Chicken",
description:"Creamy butter chicken curry with naan.",
price:340,
image:"https://images.unsplash.com/photo-1604909053196-7d0b0c1d9c0a",
category:"Indian"
},

{
name:"Chocolate Cake",
description:"Rich chocolate cake with frosting.",
price:220,
image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587",
category:"Dessert"
},

{
name:"Strawberry Cake",
description:"Soft cake topped with strawberries.",
price:210,
image:"https://images.unsplash.com/photo-1605475128023-9b5e4c58c6df",
category:"Dessert"
},

{
name:"Ice Cream Sundae",
description:"Vanilla ice cream with chocolate syrup.",
price:180,
image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb",
category:"Dessert"
}

]

await prisma.product.deleteMany()

await prisma.product.createMany({
data:foods
})

console.log("Products seeded successfully")

}

main()
.catch((e)=>{
console.error(e)
process.exit(1)
})
.finally(async()=>{
await prisma.$disconnect()
})