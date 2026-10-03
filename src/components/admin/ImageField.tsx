import { useState } from "react";
import { Input } from "../Input.tsx";
import { ProductImage } from "../ProductImage.tsx";
import { useToast } from "../../hooks/useToast.ts";
import { api } from "../../services/api.ts";
import { apiErrorMessage } from "../../utils/errors.ts";

export type ImageFolder = "products" | "categories" | "travel" | "events";

export function ImageField({
  folder,
  value,
  onChange,
}: {
  folder: ImageFolder;
  value: string;
  onChange: (url: string) => void;
}) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) {
      return;
    }
    const body = new FormData();
    body.append("file", file);
    setUploading(true);
    try {
      const { data } = await api.post<{ url: string }>(`/api/admin/uploads/${folder}`, body);
      onChange(data.url);
    } catch (reason: unknown) {
      showToast(apiErrorMessage(reason, "The image could not be uploaded."));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Input label="Image URL" value={value} onChange={(event) => onChange(event.target.value)} />
      <label className="mt-3 block text-sm">
        <span className="mb-1.5 block font-medium">Upload image</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          disabled={uploading}
          onChange={(event) => {
            void upload(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <span className="mt-1 block text-muted">{uploading ? "Uploading" : "JPG, PNG, or WebP. Up to 5 MB."}</span>
      </label>
      {value ? <ProductImage src={value} alt="" className="mt-3 aspect-4/3 w-48 rounded-2xl" /> : null}
    </div>
  );
}
