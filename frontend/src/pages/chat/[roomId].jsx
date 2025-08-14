import React from "react";
import { ChatBox } from "@/components/custom/chat/ChatBox";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ChatRoom() {
  const router = useRouter();
  const { roomId } = router.query;

  if (!roomId) return <div>Loading chat...</div>;

  return (
    <ProtectedRoute>
      <ChatBox roomId={roomId} />
    </ProtectedRoute>
  );
}
