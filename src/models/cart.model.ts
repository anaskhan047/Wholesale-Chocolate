import { model, models, Schema } from "mongoose";

const cartLineSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    categoryName: { type: String, required: true },
    sellPrice: { type: Number, required: true, min: 0 },
    piecePrice: { type: Number, min: 0 },
    packetPieceQty: { type: Number, min: 1 },
    stock: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [cartLineSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Cart = models.Cart || model("Cart", cartSchema);
