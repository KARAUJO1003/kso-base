"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  /** URL da imagem já salva (usada ao editar um registro) */
  previewUrl?: string;
  accept?: string;
  className?: string;
  maxSizeMB?: number;
  helperText?: string;
}

export function ImageUpload({
  value,
  onChange,
  previewUrl,
  accept = "image/*",
  className,
  maxSizeMB = 5,
  helperText = "PNG, JPG ou WEBP",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [removedPreviewUrl, setRemovedPreviewUrl] = useState<string>();

  const objectUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : undefined),
    [value],
  );
  const preview =
    objectUrl ?? (previewUrl !== removedPreviewUrl ? previewUrl : undefined);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    setRemovedPreviewUrl(undefined);
  }, [previewUrl]);

  const selectFile = (file?: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`A imagem deve ter no máximo ${maxSizeMB}MB.`);
      return;
    }

    onChange(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    selectFile(e.dataTransfer.files?.[0]);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setRemovedPreviewUrl(previewUrl);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={cn(
        "group relative flex aspect-[16/10] min-h-44 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/50",
        isDragging && "border-primary bg-primary/10",
        className,
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
      />

      {preview ? (
        <>
          <Image
            src={preview}
            alt="Prévia da imagem"
            className="object-cover"
            fill
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-2 rounded-md bg-background/95 px-3 py-2 text-sm font-medium shadow-sm">
              <UploadIcon className="size-4" />
              Trocar imagem
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
            aria-label="Remover imagem"
          >
            <XIcon size={18} />
          </button>
        </>
      ) : (
        <div className="flex max-w-xs flex-col items-center gap-3 p-4 text-center">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full border bg-background text-muted-foreground",
              isDragging && "border-primary bg-primary text-primary-foreground",
            )}
          >
            <ImageIcon size={24} />
          </div>
          <div className="grid gap-1">
            <span className="text-sm font-medium">
              Clique ou arraste uma imagem
            </span>
            <span className="text-xs text-muted-foreground">
              {helperText} até {maxSizeMB}MB
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
