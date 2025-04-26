"use client"

import type React from "react"
import { useState, useRef, DragEvent } from "react" // Added DragEvent
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast" // Adjust path if needed
import { Camera, File, FileText, Plus, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils" // Assuming this utility exists

interface FileUploadProps {
  onUploadComplete?: (files: File[], images: string[]) => void
  trigger?: React.ReactNode // The element that opens the dialog
  title?: string
  description?: string
  acceptedFileTypes?: string // e.g., ".pdf,.doc,.docx,.ppt,.pptx,image/*"
  maxFileSizeMB?: number
  disabled?: boolean // Allow disabling the trigger/upload
}

export function FileUpload({
  onUploadComplete,
  trigger,
  title = "Upload Files",
  description = "Upload files or take photos",
  acceptedFileTypes = ".pdf,.doc,.docx,.txt,", // Default accepted types
  maxFileSizeMB = 10, // Default max size
  disabled = false, // Default disabled state
}: FileUploadProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("file")
  const [capturedImages, setCapturedImages] = useState<string[]>([]) // Stores data URLs for previews
  const [capturedImageFiles, setCapturedImageFiles] = useState<File[]>([]) // Stores actual File objects for upload
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false); // <--- State for drag-over visual feedback
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxFileSizeMB * 1024 * 1024;

  // --- File Validation ---
  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
        // Check size
        if (file.size > maxSizeBytes) {
            errors.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the ${maxFileSizeMB}MB limit.`);
            return; // Skip this file
        }
        // Check type (if acceptedFileTypes is provided)
        if (acceptedFileTypes) {
            const acceptedTypesArray = acceptedFileTypes.split(',').map(t => t.trim().toLowerCase());
            const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
            const fileMime = file.type.toLowerCase();

            const isAccepted = acceptedTypesArray.some(type => {
                if (type.startsWith('.')) { // Check extension
                    return fileExtension === type;
                }
                if (type.includes('/')) { // Check MIME type (e.g., "image/*", "application/pdf")
                    if (type.endsWith('/*')) {
                        return fileMime.startsWith(type.replace('/*', ''));
                    }
                    return fileMime === type;
                }
                return false;
            });

            if (!isAccepted) {
                errors.push(`${file.name} has an unsupported file type.`);
                return; // Skip this file
            }
        }
        validFiles.push(file);
    });

    if (errors.length > 0) {
        toast({
            title: "Invalid Files Detected",
            description: errors.join("\n"),
            variant: "destructive",
            duration: 5000,
        });
    }
    return validFiles;
  };


  // --- Event Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const filesArray = Array.from(e.target.files)
      const validFiles = validateFiles(filesArray);
      // Add valid files to the existing selection (or replace if you prefer)
      setSelectedFiles(prev => [...prev, ...validFiles]);
      // Clear the input value so the same file can be selected again if removed
      e.target.value = '';
    }
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const validFiles = validateFiles([file]); // Validate the captured image file
      if (validFiles.length > 0) {
          const imageUrl = URL.createObjectURL(validFiles[0]);
          setCapturedImages(prev => [...prev, imageUrl]);
          setCapturedImageFiles(prev => [...prev, validFiles[0]]); // Store the File object
      }
      e.target.value = ''; // Clear input
    }
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(capturedImages[index]);
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
    setCapturedImageFiles(prev => prev.filter((_, i) => i !== index));
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }

  // --- Drag and Drop Handlers ---
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(filesArray);
       // Add valid files to the existing selection (or replace)
       setSelectedFiles(prev => [...prev, ...validFiles]);
      // Optionally switch to the file tab if files are dropped
      setActiveTab("file");
      // Clean up dataTransfer object
      if (e.dataTransfer.items) {
        e.dataTransfer.items.clear();
      } else {
        e.dataTransfer.clearData();
      }
    }
  };
  // --- End Drag and Drop ---


  const handleUpload = () => {
    const filesToUpload = activeTab === "file" ? selectedFiles : capturedImageFiles;

    if (filesToUpload.length === 0) {
      toast({
        title: `No ${activeTab === 'file' ? 'files' : 'images'} selected`,
        description: `Please select ${activeTab === 'file' ? 'files' : 'images'} to upload`,
        variant: "warning", // Use warning variant
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // --- REPLACE SIMULATION WITH ACTUAL UPLOAD LOGIC ---
    // Here you would typically call the parent's onUploadComplete immediately
    // and let the parent handle the actual upload API call and progress.
    // The progress bar here becomes less meaningful unless you track
    // progress from the parent or use a library that provides upload progress.

    // For demonstration, we keep the simulation, but call onUploadComplete *before* it starts
    if (onUploadComplete) {
        // Pass the correct set of files based on the active tab
        onUploadComplete(filesToUpload, capturedImages); // Pass File objects and preview URLs
    }

    // --- SIMULATED PROGRESS (Remove or replace with real progress tracking) ---
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setOpen(false) // Close dialog on completion

          toast({
            title: "Upload Initiated",
            description: "Your files are being processed.", // More accurate message
          })

          // Reset the form AFTER parent likely started the actual upload
          setSelectedFiles([])
          setCapturedImages([])
          setCapturedImageFiles([]) // Reset captured files too

          return 100 // Stay at 100 briefly
        }
        return prev + 20 // Faster simulation
      })
    }, 200)
     // --- End Simulation ---
  }

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerCameraInput = () => cameraInputRef.current?.click();

  // --- File Icon Helper ---
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf": return <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />;
      case "doc": case "docx": return <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />;
      case "ppt": case "pptx": return <FileText className="h-5 w-5 text-orange-500 flex-shrink-0" />;
      case "jpg": case "jpeg": case "png": case "gif": case "webp": return <FileText className="h-5 w-5 text-teal-500 flex-shrink-0" />; // Example for images
      default: return <File className="h-5 w-5 text-gray-500 flex-shrink-0" />;
    }
  }

  // Reset state when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
          // Reset everything when closing
          setSelectedFiles([]);
          setCapturedImages([]);
          setCapturedImageFiles([]);
          setIsUploading(false);
          setUploadProgress(0);
          setActiveTab("file"); // Reset to default tab
          setIsDragging(false);
      }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Use provided trigger or default button, disable if needed */}
      <DialogTrigger asChild disabled={disabled}>
          {trigger || <Button disabled={disabled}>Upload Files</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]"> {/* Slightly wider */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload Files</TabsTrigger>
            <TabsTrigger value="camera">Take Photos</TabsTrigger>
          </TabsList>

          {/* File Upload Tab */}
          <TabsContent value="file" className="space-y-4 py-4">
            {/* --- Drag and Drop Zone --- */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200",
                "border-gray-300 dark:border-gray-600",
                isDragging
                  ? "border-primary bg-primary/10 dark:border-primary/70 dark:bg-primary/20" // Style when dragging over
                  : "hover:border-gray-400 hover:bg-gray-50 dark:hover:border-gray-500 dark:hover:bg-gray-800/20" // Default hover
              )}
              onClick={triggerFileInput}
              onDragOver={handleDragOver} // <--- Added handler
              onDragLeave={handleDragLeave} // <--- Added handler
              onDrop={handleDrop} // <--- Added handler
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple // Allow multiple file selection
                accept={acceptedFileTypes} // Use prop for accepted types
              />
              <Upload className={cn(
                  "h-10 w-10 mx-auto mb-2",
                  isDragging ? "text-primary" : "text-gray-400 dark:text-gray-500"
              )} />
              <p className={cn(
                  "text-sm font-medium",
                  isDragging ? "text-primary" : "text-gray-700 dark:text-gray-300"
              )}>
                {isDragging ? "Drop files here!" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {/* Display accepted types dynamically */}
                {acceptedFileTypes.split(',').map(t => t.trim().toUpperCase().replace('.','')).join(', ')} (Max {maxFileSizeMB}MB)
              </p>
            </div>
            {/* --- End Drag and Drop Zone --- */}

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Selected Files ({selectedFiles.length})</h4>
                <ScrollArea className="h-[150px] border rounded-md p-2 bg-background dark:bg-gray-800/10">
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/30 p-2 rounded text-gray-800 dark:text-gray-200">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {getFileIcon(file.name)}
                          <span className="text-sm truncate" title={file.name}>{file.name}</span>
                           <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          {/* Camera Tab */}
          <TabsContent value="camera" className="space-y-4 py-4">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
              onClick={triggerCameraInput}
            >
              <input
                type="file"
                ref={cameraInputRef}
                onChange={handleCameraCapture}
                className="hidden"
                accept="image/*" // Only accept images
                capture="environment" // Prioritize back camera
              />
              <Camera className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to take a photo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add multiple photos if needed.</p>
            </div>

            {/* Captured Images Preview */}
            {capturedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Captured Images ({capturedImages.length})</h4>
                <div className="grid grid-cols-3 gap-2"> {/* Use 3 columns for smaller previews */}
                  {capturedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image} // Object URL
                        alt={`Captured ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-border" // Smaller preview
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" // Show on hover
                        onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                   {/* Add More Button */}
                   <button
                     type="button"
                     className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary"
                     onClick={triggerCameraInput}
                     aria-label="Take another photo"
                   >
                     <Plus className="h-6 w-6" />
                   </button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-1 pt-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Dialog Footer */}
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || (activeTab === 'file' && selectedFiles.length === 0) || (activeTab === 'camera' && capturedImageFiles.length === 0)}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
