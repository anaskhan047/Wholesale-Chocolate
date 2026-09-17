export function formatPrice(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
