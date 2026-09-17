"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useSaveProduct } from "@/hooks/use-admin";
import type { CategoryItem } from "@/types/category";
import type { ProductItem } from "@/types/product";

type ProductFormProps = {
  product?: ProductItem | null;
  categories: CategoryItem[];
  onSaved: (product: ProductItem) => void;
  onCancel?: () => void;
};

function toInputValue(value?: number) {
  return value === undefined || value === null ? "" : String(value);
}

export function ProductForm({
  product,
  categories,
  onSaved,
  onCancel,
}: ProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [buyPrice, setBuyPrice] = useState(toInputValue(product?.buyPrice));
  const [sellPrice, setSellPrice] = useState(toInputValue(product?.sellPrice));
  const [piecePrice, setPiecePrice] = useState(toInputValue(product?.piecePrice));
  const [packetPieceQty, setPacketPieceQty] = useState(
    toInputValue(product?.packetPieceQty),
  );
  const [quantity, setQuantity] = useState(toInputValue(product?.quantity));
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(product?.imageUrl ?? "");
  const [error, setError] = useState("");
  const saveProduct = useSaveProduct();
  const loading = saveProduct.isPending;
  const isEdit = Boolean(product);

  useEffect(() => {
    setName(product?.name ?? "");
    setCategoryId(product?.categoryId ?? "");
    setBuyPrice(toInputValue(product?.buyPrice));
    setSellPrice(toInputValue(product?.sellPrice));
    setPiecePrice(toInputValue(product?.piecePrice));
    setPacketPieceQty(toInputValue(product?.packetPieceQty));
    setQuantity(toInputValue(product?.quantity));
    setImage(null);
    setPreview(product?.imageUrl ?? "");
    setError("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }, [product]);

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : product?.imageUrl ?? "");
  }

  function resetCreateForm() {
    setName("");
    setCategoryId("");
    setBuyPrice("");
    setSellPrice("");
    setPiecePrice("");
    setPacketPieceQty("");
    setQuantity("");
    setImage(null);
    setPreview("");
    formRef.current?.reset();
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      if (!isEdit && !image) {
        throw new Error("Please choose a product image");
      }

      const form = new FormData();
      form.set("name", name);
      form.set("categoryId", categoryId);
      form.set("buyPrice", buyPrice);
      form.set("sellPrice", sellPrice);
      form.set("piecePrice", piecePrice);
      form.set("packetPieceQty", packetPieceQty);
      form.set("quantity", quantity);
      if (image) {
        form.set("image", image);
      }

      const saved = await saveProduct.mutateAsync({
        id: product?.id,
        form,
      });
      onSaved(saved);
      if (!isEdit) {
        resetCreateForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <Input
        id="product-name"
        label="Product name"
        placeholder="Cocoa bar 100g"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <Select
        id="product-category"
        label="Category"
        placeholder="Choose category"
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))}
        required
      />
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Input
          id="buy-price"
          label="Buy price"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="80"
          value={buyPrice}
          onChange={(event) => setBuyPrice(event.target.value)}
          required
        />
        <Input
          id="sell-price"
          label="Sell price"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="120"
          value={sellPrice}
          onChange={(event) => setSellPrice(event.target.value)}
          required
        />
        <Input
          id="piece-price"
          label="Per piece"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="Optional"
          value={piecePrice}
          onChange={(event) => setPiecePrice(event.target.value)}
        />
        <Input
          id="packet-qty"
          label="Packet pcs"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          placeholder="Optional"
          value={packetPieceQty}
          onChange={(event) => setPacketPieceQty(event.target.value)}
        />
      </div>
      <Input
        id="quantity"
        label="Quantity"
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        placeholder="100"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        required
      />
      <label className="block w-full min-w-0" htmlFor="product-image">
        <span className="mb-1.5 block text-sm font-medium">
          {isEdit ? "Change image" : "Product image"}
        </span>
        <input
          ref={fileRef}
          id="product-image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onImageChange}
          required={!isEdit}
          className="block w-full min-w-0 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground sm:text-sm"
        />
        {isEdit ? (
          <span className="mt-1 block text-xs text-muted-foreground">
            Leave empty to keep the current image.
          </span>
        ) : null}
      </label>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Product preview"
          className="h-28 w-full rounded-xl object-cover sm:h-36"
        />
      ) : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
