import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, SendHorizontal, X, Loader2 } from "lucide-react";

export const ChatInput = ({ onSend, isUploading = false, uploadError = null }) => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selected.size > maxSize) {
        alert("File size must be less than 10MB");
        return;
      }
      setFile(selected);
    }
  };

  const handleSend = () => {
    if (isUploading) return; // Prevent sending while uploading
    if (!input.trim() && !file) return;

    onSend({ text: input.trim(), file });
    setInput("");
    setFile(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full border-t px-3 py-2">
      {/* File Preview */}
      {file && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2 p-2 bg-muted rounded">
          <div className="flex items-center gap-2">
            <span>📎</span>
            <span className="truncate max-w-[200px]">{file.name}</span>
            <span className="text-xs">({formatFileSize(file.size)})</span>
          </div>
          <button 
            onClick={removeFile} 
            className="hover:text-red-500 transition-colors"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="text-sm text-red-500 mb-2 p-2 bg-red-50 rounded">
          Upload failed: {uploadError}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* File Attach Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>

        {/* Message Input */}
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          disabled={isUploading}
        />

        {/* Send Button */}
        <Button 
          size="icon" 
          onClick={handleSend}
          disabled={isUploading || (!input.trim() && !file)}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SendHorizontal className="w-4 h-4" />
          )}
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="*/*" // Accept all file types
        />
      </div>
    </div>
  );
};