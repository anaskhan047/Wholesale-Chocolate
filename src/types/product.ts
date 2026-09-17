export type ProductItem = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  buyPrice: number;
  sellPrice: number;
  piecePrice?: number;
  packetPieceQty?: number;
  quantity: number;
  imageUrl: string;
  createdAt: string;
};

export type ProductPage = {
  items: ProductItem[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
