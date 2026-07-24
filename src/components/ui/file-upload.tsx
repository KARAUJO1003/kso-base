"use client";

import { useRef, useState } from "react";
import { FileIcon, PaperclipIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  /** Nome/URL de um arquivo já salvo (usado ao editar um registro) */
  existingLabel?: string;
  existingUrl?: string;
  accept?: string;
  className?: string;
  maxSizeMB?: number;
  helperText?: string;
  placeholder?: string;
}

/**
 * Seletor de arquivo genérico (não restrito a imagens), com preview textual
 * do nome selecionado. Use `ImageUpload` quando o arquivo precisar de
 * pré-visualização visual (ex: logo).
 */
export function FileUpload({
  value,
  onChange,
  existingLabel,
  existingUrl,
  accept = "image/*,application/pdf",
  className,
  maxSizeMB = 10,
  helperText = "Imagem ou PDF",
  placeholder = "Clique ou arraste um arquivo",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = (file?: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`O arquivo deve ter no máximo ${maxSizeMB}MB.`);
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
    if (inputRef.current) inputRef.current.value = "";
  };

  const selectedLabel = value?.name;
  const displayLabel = selectedLabel || existingLabel;

  return (
    <div
      className={cn(
        "group relative flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50",
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

      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
        <FileIcon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        {displayLabel ? (
          <a
            href={!selectedLabel ? existingUrl : undefined}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (selectedLabel) e.preventDefault();
              e.stopPropagation();
            }}
            className="flex items-center gap-1.5 truncate text-sm font-medium"
          >
            <PaperclipIcon size={14} className="shrink-0" />
            <span className="truncate">{displayLabel}</span>
          </a>
        ) : (
          <span className="text-sm font-medium">{placeholder}</span>
        )}
        <p className="text-xs text-muted-foreground">
          {helperText} até {maxSizeMB}MB
        </p>
      </div>

      {value && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
          aria-label="Remover arquivo"
        >
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
}
