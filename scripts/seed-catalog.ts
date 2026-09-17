import { loadEnv } from "./load-env";

loadEnv();

import { connectDb } from "../src/lib/db";
import { uploadImageFromUrl } from "../src/lib/cloudinary";
import { toSlug } from "../src/lib/slug";
import { Category } from "../src/models/category.model";
import { Product } from "../src/models/product.model";

type SeedProduct = {
  name: string;
  image: string;
  buyPrice: number;
  sellPrice: number;
  piecePrice?: number;
  packetPieceQty?: number;
  quantity: number;
};

type SeedCategory = {
  name: string;
  image: string;
  products: SeedProduct[];
};

function photo(id: number) {
  if (id === 65882) {
    return "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=800";
  }

  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;
}

const CATALOG: SeedCategory[] = [
  {
    name: "Dark Chocolate",
    image: photo(65882),
    products: [
      {
        name: "70% Cocoa Couverture 1kg",
        image: photo(918327),
        buyPrice: 420,
        sellPrice: 560,
        piecePrice: 28,
        packetPieceQty: 20,
        quantity: 80,
      },
      {
        name: "85% Bitter Slabs 500g",
        image: photo(1098592),
        buyPrice: 310,
        sellPrice: 430,
        quantity: 64,
      },
      {
        name: "Dark Baking Chips 2.5kg",
        image: photo(1028714),
        buyPrice: 890,
        sellPrice: 1180,
        quantity: 36,
      },
      {
        name: "Single Origin Ecuador Bars",
        image: photo(140831),
        buyPrice: 240,
        sellPrice: 340,
        piecePrice: 85,
        packetPieceQty: 4,
        quantity: 120,
      },
      {
        name: "Dark Ganache Blocks",
        image: photo(1854652),
        buyPrice: 510,
        sellPrice: 690,
        quantity: 42,
      },
    ],
  },
  {
    name: "Milk Chocolate",
    image: photo(2067396),
    products: [
      {
        name: "Creamy Milk Buttons 1kg",
        image: photo(2373520),
        buyPrice: 360,
        sellPrice: 490,
        piecePrice: 12,
        packetPieceQty: 40,
        quantity: 90,
      },
      {
        name: "Milk Compound Slabs",
        image: photo(2693447),
        buyPrice: 275,
        sellPrice: 380,
        quantity: 70,
      },
      {
        name: "Hazelnut Milk Batons",
        image: photo(3734026),
        buyPrice: 430,
        sellPrice: 590,
        piecePrice: 35,
        packetPieceQty: 16,
        quantity: 55,
      },
      {
        name: "Caramel Milk Coins",
        image: photo(4110003),
        buyPrice: 198,
        sellPrice: 275,
        piecePrice: 8,
        packetPieceQty: 24,
        quantity: 150,
      },
      {
        name: "Malted Milk Squares 750g",
        image: photo(4791265),
        buyPrice: 325,
        sellPrice: 455,
        piecePrice: 16,
        packetPieceQty: 24,
        quantity: 88,
      },
    ],
  },
  {
    name: "White Chocolate",
    image: photo(1055272),
    products: [
      {
        name: "Ivory White Couverture",
        image: photo(3776942),
        buyPrice: 470,
        sellPrice: 640,
        quantity: 48,
      },
      {
        name: "White Chocolate Callets",
        image: photo(887853),
        buyPrice: 390,
        sellPrice: 530,
        piecePrice: 18,
        packetPieceQty: 25,
        quantity: 75,
      },
      {
        name: "Vanilla White Bars 80g",
        image: photo(1907642),
        buyPrice: 95,
        sellPrice: 145,
        piecePrice: 145,
        packetPieceQty: 12,
        quantity: 200,
      },
      {
        name: "White Baking Chunks 1.5kg",
        image: photo(209206),
        buyPrice: 620,
        sellPrice: 820,
        quantity: 28,
      },
      {
        name: "White Drizzle Wafers",
        image: photo(4109998),
        buyPrice: 210,
        sellPrice: 295,
        piecePrice: 15,
        packetPieceQty: 18,
        quantity: 110,
      },
    ],
  },
  {
    name: "Truffles & Pralines",
    image: photo(616326),
    products: [
      {
        name: "Cocoa Dust Truffle Box",
        image: photo(1343504),
        buyPrice: 540,
        sellPrice: 760,
        piecePrice: 42,
        packetPieceQty: 16,
        quantity: 40,
      },
      {
        name: "Salted Caramel Truffles",
        image: photo(1055271),
        buyPrice: 480,
        sellPrice: 680,
        piecePrice: 38,
        packetPieceQty: 12,
        quantity: 52,
      },
      {
        name: "Hazelnut Praline Bites",
        image: photo(4109994),
        buyPrice: 390,
        sellPrice: 550,
        piecePrice: 22,
        packetPieceQty: 20,
        quantity: 68,
      },
      {
        name: "Raspberry Truffle Pack",
        image: photo(1235701),
        buyPrice: 450,
        sellPrice: 640,
        quantity: 34,
      },
      {
        name: "Coffee Liqueur Truffles",
        image: photo(2144112),
        buyPrice: 520,
        sellPrice: 740,
        piecePrice: 46,
        packetPieceQty: 12,
        quantity: 38,
      },
    ],
  },
  {
    name: "Gift Hampers",
    image: photo(3992134),
    products: [
      {
        name: "Corporate Gift Tower",
        image: photo(4110007),
        buyPrice: 890,
        sellPrice: 1290,
        quantity: 24,
      },
      {
        name: "Festive Hamper Box",
        image: photo(992821),
        buyPrice: 720,
        sellPrice: 1050,
        quantity: 30,
      },
      {
        name: "Wedding Favor Packs",
        image: photo(108370),
        buyPrice: 260,
        sellPrice: 390,
        piecePrice: 39,
        packetPieceQty: 10,
        quantity: 180,
      },
      {
        name: "Mini Assortment Crate",
        image: photo(247468),
        buyPrice: 340,
        sellPrice: 499,
        quantity: 60,
      },
      {
        name: "Luxury Ribbon Box Set",
        image: photo(3338681),
        buyPrice: 980,
        sellPrice: 1450,
        quantity: 18,
      },
    ],
  },
];

const FALLBACK_IMAGE = photo(291528);

async function uploadSafe(imageUrl: string, folder: string) {
  try {
    return await uploadImageFromUrl(imageUrl, folder);
  } catch (error) {
    console.warn(`Upload failed, using fallback: ${imageUrl}`, error);
    return uploadImageFromUrl(FALLBACK_IMAGE, folder);
  }
}

async function seed() {
  await connectDb();

  let categoryCount = 0;
  let productCount = 0;

  for (const item of CATALOG) {
    const slug = toSlug(item.name);
    let category = await Category.findOne({ slug });

    if (!category) {
      const image = await uploadSafe(item.image, "wholesale-chocolate/categories");
      category = await Category.create({
        name: item.name,
        slug,
        imageUrl: image.url,
        imagePublicId: image.publicId,
      });
      categoryCount += 1;
      console.log(`Category created: ${item.name}`);
    } else {
      console.log(`Category exists: ${item.name}`);
    }

    for (const product of item.products) {
      const productSlug = toSlug(product.name);
      const exists = await Product.exists({
        slug: productSlug,
        category: category._id,
      });
      if (exists) {
        console.log(`  Product exists: ${product.name}`);
        continue;
      }

      const image = await uploadSafe(product.image, "wholesale-chocolate/products");
      await Product.create({
        name: product.name,
        slug: productSlug,
        category: category._id,
        buyPrice: product.buyPrice,
        sellPrice: product.sellPrice,
        piecePrice: product.piecePrice,
        packetPieceQty: product.packetPieceQty,
        quantity: product.quantity,
        imageUrl: image.url,
        imagePublicId: image.publicId,
      });
      productCount += 1;
      console.log(`  Product created: ${product.name}`);
    }
  }

  console.log(`Done. New categories: ${categoryCount}, new products: ${productCount}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
