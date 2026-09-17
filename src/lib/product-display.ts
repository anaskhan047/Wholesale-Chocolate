export function isOutOfStock(quantity: number) {
  return !Number.isFinite(quantity) || quantity <= 0;
}

export function hasOptionalAmount(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
