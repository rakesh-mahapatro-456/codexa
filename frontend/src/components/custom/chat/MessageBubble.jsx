import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Download, Image, Video, Music, Archive } from "lucide-react";

// Helper function to get file icon based on file type
const getFileIcon = (fileName, fileType) => {
  if (!fileName && !fileType) return FileText;
  
  const type = fileType?.toLowerCase() || fileName?.split('.').pop()?.toLowerCase();
  
  if (type?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(type)) {
    return Image;
  }
  if (type?.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(type)) {
    return Video;
  }
  if (type?.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac', 'm4a'].includes(type)) {
    return Music;
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(type)) {
    return Archive;
  }
  return FileText;
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "Unknown size";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const MessageBubble = ({ 
  message, 
  isOwn = false, 
  sender = "User", 
  showSender = false 
}) => {
  const senderInitial = sender ? sender.charAt(0).toUpperCase() : "U";

  const handleFileDownload = (fileUrl, fileName) => {
    if (fileUrl) {
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderFilePreview = (file) => {
    if (!file) return null;

    const FileIcon = getFileIcon(file.name, file.type);
    const isImage = file.type?.startsWith('image/') || 
                   ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
                     file.name?.split('.').pop()?.toLowerCase()
                   );

    return (
      <div className="mt-2 border rounded-lg p-3 bg-background/50">
        {/* Image Preview */}
        {isImage && file.url && (
          <div className="mb-2">
            <img 
              src={file.url} 
              alt={file.name}
              className="max-w-full max-h-40 rounded object-cover cursor-pointer"
              onClick={() => window.open(file.url, '_blank')}
            />
          </div>
        )}
        
        {/* File Info */}
        <div className="flex items-center gap-2 text-sm">
          <FileIcon className="w-4 h-4" />
          <div className="flex-1 min-w-0">
            <div className="truncate font-medium">{file.name || "Unknown file"}</div>
            <div className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </div>
          </div>
          
          {/* Download Button */}
          {file.url && (
            <button
              onClick={() => handleFileDownload(file.url, file.name)}
              className="p-1 hover:bg-background/80 rounded transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {/* Avatar only for other person */}
      {!isOwn && (
        <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
          <AvatarFallback className="text-sm font-semibold bg-primary/10">
            {senderInitial}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col max-w-xs md:max-w-sm">
        {/* Sender Name */}
        {!isOwn && showSender && (
          <div className="text-xs text-muted-foreground mb-1 px-1">
            {sender}
          </div>
        )}

        {/* Message Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`relative rounded-lg px-4 py-2 text-sm break-words ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted rounded-bl-none"
          }`}
        >
          {/* Message Text */}
          {message.text && (
            <div className="whitespace-pre-wrap">{message.text}</div>
          )}

          {/* File Attachment */}
          {message.file && renderFilePreview(message.file)}
        </motion.div>

        {/* Timestamp */}
        <div className={`text-xs text-muted-foreground mt-1 px-1 ${
          isOwn ? "text-right" : "text-left"
        }`}>
          {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Right side spacing if own message */}
      {isOwn && (
        <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
          <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
            {sender ? sender.charAt(0).toUpperCase() : "Y"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};