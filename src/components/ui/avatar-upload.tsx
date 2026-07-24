"use client";

import { useRef } from "react";
import { CameraIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  /** URL do avatar já salvo (usada ao editar um registro) */
  previewUrl?: string;
  accept?: string;
  className?: string;
}

export function AvatarUpload({
  value,
  onChange,
  previewUrl,
  accept = "image/*",
  className,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const objectUrl = value ? URL.createObjectURL(value) : undefined;
  const preview = objectUrl ?? previewUrl;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] ?? null);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className="group relative size-24 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/40 transition-colors hover:bg-muted/70"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleChange}
        />

        {preview ? (
          <Image
            src={preview}
            alt="avatar"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <CameraIcon size={28} />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <CameraIcon size={20} className="text-white" />
        </div>
      </div>

      {(value || previewUrl) && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
        >
          <XIcon size={10} />
        </button>
      )}
    </div>
  );
}
