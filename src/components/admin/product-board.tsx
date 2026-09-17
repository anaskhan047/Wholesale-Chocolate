"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/admin/product-card";
import { ProductForm } from "@/components/admin/product-form";
import { Button, buttonClass } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  useAdminCategories,
  useAdminProducts,
  useDeleteProduct,
} from "@/hooks/use-admin";
import { joinClass, motionClass } from "@/lib/motion";
import type { CategoryItem } from "@/types/category";
import type { ProductItem } from "@/types/product";

type ProductBoardProps = {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
};

export function ProductBoard({
  initialProducts,
  categories: initialCategories,
}: ProductBoardProps) {
  const { data: products = [] } = useAdminProducts(initialProducts);
  const { data: categories = [] } = useAdminCategories(initialCategories);
  const deleteProduct = useDeleteProduct();
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [deleting, setDeleting] = useState<ProductItem | null>(null);
  const [message, setMessage] = useState("");
  const canCreate = categories.length > 0;
  const busyId = deleteProduct.isPending ? deleteProduct.variables : "";

  function closeForm() {
    setOpenForm(false);
    setEditing(null);
  }

  function onSaved() {
    closeForm();
    setMessage(editing ? "Product updated" : "Product created");
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-caramel sm:text-xs">
            Product
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight sm:mt-2 sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
            Add products with prices, stock, and images. Changing an image
            removes the old one from Cloudinary.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0"
          disabled={!canCreate}
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
        >
          Add
        </Button>
      </div>

      {message ? (
        <p
          className={joinClass(
            motionClass("pop"),
            "mt-3 rounded-xl border border-border bg-muted px-3 py-2 text-xs sm:mt-4 sm:text-sm",
          )}
        >
          {message}
        </p>
      ) : null}

      {!canCreate ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-4 py-8 text-center sm:mt-6">
          <p className="font-semibold">Create a category first</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Products must belong to a category.
          </p>
          <Link href="/admin/categories" className={`${buttonClass("secondary", "sm")} mt-4`}>
            Go to categories
          </Link>
        </div>
      ) : products.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center sm:mt-6">
          <p className="font-semibold">No products yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a product with name, category, prices, quantity, and image.
          </p>
        </div>
      ) : (
        <section className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              busy={busyId === product.id}
              onEdit={(item) => {
                setOpenForm(false);
                setEditing(item);
              }}
              onDelete={setDeleting}
            />
          ))}
        </section>
      )}

      {openForm || editing ? (
        <Modal maxWidth="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-caramel">
            {editing ? "Edit product" : "New product"}
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            {editing ? "Update details" : "Create product"}
          </h2>
          <div className="mt-4">
            <ProductForm
              product={editing}
              categories={categories}
              onSaved={onSaved}
              onCancel={closeForm}
            />
          </div>
        </Modal>
      ) : null}

      {deleting ? (
        <Modal maxWidth="max-w-sm">
          <h2 className="text-lg font-semibold">Delete product?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {deleting.name} and its Cloudinary image will be removed.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={() =>
                deleteProduct.mutate(deleting.id, {
                  onSuccess: () => {
                    setMessage("Product deleted");
                    setDeleting(null);
                  },
                  onError: (error) => {
                    setMessage(
                      error instanceof Error ? error.message : "Delete failed",
                    );
                  },
                })
              }
              disabled={busyId === deleting.id}
            >
              {busyId === deleting.id ? "Deleting..." : "Yes, delete"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleting(null)}
              disabled={busyId === deleting.id}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
