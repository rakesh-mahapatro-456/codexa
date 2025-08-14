import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

export const MatchedModal = ({ open, onClose, roomId, duration, role }) => {
  const router = useRouter();

  useEffect(() => {
    console.log("[MatchedModal] Props:", { open, roomId, role });
    
    // Auto-redirect for askers, show modal for helpers
    if (open && roomId && role === "asker") {
      console.log("[MatchedModal] Auto-redirecting asker to chat");
      handleJoinRoom();
    }
  }, [open, roomId, role]);

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      console.log("[MatchedModal] Modal closed via backdrop/escape");
      onClose?.();
    }
  };

  const handleJoinRoom = async () => {
    console.log("[MatchedModal] Join Room clicked with roomId:", roomId);
    if (!roomId) {
      console.log("[MatchedModal] No roomId available");
      return;
    }
    
    try {
      console.log("[MatchedModal] Navigating to:", `/chat/${roomId}`);
      await router.push(`/chat/${roomId}`);
      console.log("[MatchedModal] Navigation completed, calling onClose");
      onClose?.();
    } catch (error) {
      console.error("[MatchedModal] Navigation failed:", error);
    }
  };

  // Don't show modal for askers (they get auto-redirected)
  if (role === "asker") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>🎉 You've been matched!</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Someone needs your help!</p>
          <p>
            <strong>Room ID:</strong> {roomId}
          </p>
          <p>
            <strong>Duration:</strong> {duration} mins
          </p>
          <p>
            <strong>Role:</strong> Helper
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleJoinRoom} className="w-full">
            Join Room & Help
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};