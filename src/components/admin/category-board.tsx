"use client";

import { useState } from "react";
import { CategoryCard } from "@/components/admin/category-card";
import { CategoryForm } from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAdminCategories, useDeleteCategory } from "@/hooks/use-admin";
import { joinClass, motionClass } from "@/lib/motion";
import type { CategoryItem } from "@/types/category";

type CategoryBoardProps = {
  initialCategories: CategoryItem[];
};

export function CategoryBoard({ initialCategories }: CategoryBoardProps) {
  const { data: categories = [] } = useAdminCategories(initialCategories);
  const deleteCategory = useDeleteCategory();
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const [deleting, setDeleting] = useState<CategoryItem | null>(null);
  const [message, setMessage] = useState("");
  const busyId = deleteCategory.isPending ? deleteCategory.variables : "";

  function closeForm() {
    setOpenForm(false);
    setEditing(null);
  }

  function onSaved() {
    closeForm();
    setMessage(editing ? "Category updated" : "Category created");
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-caramel sm:text-xs">
            Category
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight sm:mt-2 sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
            Add, edit, or delete categories. Changing an image removes the old
            one from Cloudinary.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0"
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

      {categories.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center sm:mt-6">
          <p className="font-semibold">No categories yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create one with a name and image.
          </p>
        </div>
      ) : (
        <section className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              busy={busyId === category.id}
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
        <Modal>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-caramel">
            {editing ? "Edit category" : "New category"}
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            {editing ? "Update details" : "Create category"}
          </h2>
          <div className="mt-4">
            <CategoryForm
              category={editing}
              onSaved={onSaved}
              onCancel={closeForm}
            />
          </div>
        </Modal>
      ) : null}

      {deleting ? (
        <Modal maxWidth="max-w-sm">
          <h2 className="text-lg font-semibold">Delete category?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {deleting.name} and its Cloudinary image will be removed.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={() =>
                deleteCategory.mutate(deleting.id, {
                  onSuccess: () => {
                    setMessage("Category deleted");
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
