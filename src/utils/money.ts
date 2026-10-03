export function formatPaise(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);
}

export function rupeesToPaise(value: string) {
  const amount = Number(value);
  if (!value.trim() || Number.isNaN(amount) || amount < 0) {
    return undefined;
  }
  return Math.round(amount * 100);
}

export function sellingPrice(price: number, salePrice: number | null) {
  return salePrice ?? price;
}
