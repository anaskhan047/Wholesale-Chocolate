"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSaveCategory } from "@/hooks/use-admin";
import type { CategoryItem } from "@/types/category";

type CategoryFormProps = {
  category?: CategoryItem | null;
  onSaved: (category: CategoryItem) => void;
  onCancel?: () => void;
};

export function CategoryForm({ category, onSaved, onCancel }: CategoryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(category?.name ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(category?.imageUrl ?? "");
  const [error, setError] = useState("");
  const saveCategory = useSaveCategory();
  const loading = saveCategory.isPending;
  const isEdit = Boolean(category);

  useEffect(() => {
    setName(category?.name ?? "");
    setImage(null);
    setPreview(category?.imageUrl ?? "");
    setError("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }, [category]);

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : category?.imageUrl ?? "");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      if (!isEdit && !image) {
        throw new Error("Please choose a category image");
      }

      const form = new FormData();
      form.set("name", name);
      if (image) {
        form.set("image", image);
      }

      const saved = await saveCategory.mutateAsync({
        id: category?.id,
        form,
      });
      onSaved(saved);
      if (!isEdit) {
        setName("");
        setImage(null);
        setPreview("");
        formRef.current?.reset();
        if (fileRef.current) {
          fileRef.current.value = "";
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <Input
        id="category-name"
        label="Category name"
        placeholder="Dark chocolate"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <label className="block w-full min-w-0" htmlFor="category-image">
        <span className="mb-1.5 block text-sm font-medium">
          {isEdit ? "Change image" : "Category image"}
        </span>
        <input
          ref={fileRef}
          id="category-image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onImageChange}
          required={!isEdit}
          className="block w-full min-w-0 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
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
          alt="Category preview"
          className="h-36 w-full rounded-xl object-cover"
        />
      ) : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Save changes" : "Create category"}
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
