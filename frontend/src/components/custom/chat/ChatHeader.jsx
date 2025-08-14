import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ChatHeader = ({ roomId = "123456", onClose }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-muted">
      {/* Room Info */}
      <div className="text-sm font-medium text-muted-foreground">
        Room ID: <span className="text-foreground">{roomId}</span>
      </div>

      {/* Leave Button */}
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Leave Room
        </Button>
      )}
    </div>
  );
};

export default ChatHeader;
