import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export function FileDropzone({ 
  files, 
  onFilesChange, 
  accept = 'image/*,.pdf,.doc,.docx',
  maxFiles = 5,
  maxSize = 10 
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => file.size <= maxSize * 1024 * 1024);
    const newFiles = [...files, ...validFiles].slice(0, maxFiles);
    onFilesChange(newFiles);
  }, [files, maxFiles, maxSize, onFilesChange]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => file.size <= maxSize * 1024 * 1024);
      const newFiles = [...files, ...validFiles].slice(0, maxFiles);
      onFilesChange(newFiles);
    }
  }, [files, maxFiles, maxSize, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn('dropzone cursor-pointer', isDragging && 'active')}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              'w-12 h-12 rounded-full bg-muted flex items-center justify-center transition-colors',
              isDragging && 'bg-primary/10'
            )}>
              <Upload className={cn(
                'w-6 h-6 text-muted-foreground transition-colors',
                isDragging && 'text-primary'
              )} />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Max {maxFiles} files, {maxSize}MB each. Supports images, PDFs, and documents.
              </p>
            </div>
          </div>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const Icon = getFileIcon(file.type);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group animate-fade-in"
              >
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
