export type CartLine = {
  productId: string;
  name: string;
  imageUrl: string;
  categoryName: string;
  sellPrice: number;
  piecePrice?: number;
  packetPieceQty?: number;
  stock: number;
  qty: number;
};

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  delivery: number;
  total: number;
};
