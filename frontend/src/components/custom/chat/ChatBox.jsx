import React, { useEffect, useRef, useState } from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import ChatHeader from "./ChatHeader";
import { useSelector, useDispatch } from "react-redux";
import { useRoomChatSocket } from "@/components/custom/hook/useRoomChatSocket";
import { useRouter } from "next/router";
import { resetPartyState } from "@/store/feature/party/partySlice";
import { uploadFile } from "@/store/feature/upload/uploadThunk";

export const ChatBox = ({ roomId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { socketRef, endSession } = useRoomChatSocket(useSelector((state) => state.auth.token));
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const username = useSelector((state) => state.auth.user?.username || "You");
  const userId = useSelector((state) => state.auth.user?._id);
  const { uploading, uploadedFileUrl, error: uploadError } = useSelector((state) => state.upload);

  useEffect(() => {
    if (!socketRef.current || !roomId) return;

    const socket = socketRef.current;

    // Join the chat room on mount
    console.log(`[ChatBox] Joining room: ${roomId}`);
    socket.emit("join-room", roomId);

    // Listen for incoming messages
    const handleReceiveMessage = (data) => {
      console.log("[ChatBox] Received message:", data);
      
      // Handle both the message structure from backend and optimistic updates
      const messageData = data.message || data;
      
      setMessages((prev) => [
        ...prev,
        {
          text: messageData.text || messageData.message?.text,
          file: messageData.file || messageData.message?.file,
          fileUrl: messageData.fileUrl || messageData.message?.fileUrl,
          own: data.sender === username,
          timestamp: data.timestamp || new Date().toISOString(),
          sender: data.sender,
          senderInitial: data.sender ? data.sender.charAt(0).toUpperCase() : "U",
        },
      ]);

      // Auto scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

    // Listen for session ended
    const handleSessionEnded = (data) => {
      console.log("[ChatBox] Session ended:", data);
      // Redirect back to main party page
      router.push("/party");
      dispatch(resetPartyState());
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("session-ended", handleSessionEnded);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("session-ended", handleSessionEnded);
    };
  }, [roomId, socketRef, username, router, dispatch]);

  const handleSend = async ({ text, file }) => {
    if (!socketRef.current || (!text?.trim() && !file)) return;

    let fileUrl = null;
    let fileData = null;

    // Handle file upload if file is present
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResult = await dispatch(uploadFile(formData)).unwrap();
        fileUrl = uploadResult.url;
        fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl
        };
      } catch (error) {
        console.error("[ChatBox] File upload failed:", error);
        return; // Don't send message if file upload fails
      }
    }

    console.log("[ChatBox] Sending message:", { text, file: fileData, fileUrl });

    // Send to server
    socketRef.current.emit("send-message", {
      roomId,
      message: { 
        text, 
        file: fileData,
        fileUrl 
      },
    });

    // DON'T add optimistically - let the server send it back
    // This prevents duplicate messages and ensures consistent message order
  };

  const handleClose = () => {
    console.log("[ChatBox] Closing chat and ending session");
    // End the session when closing chat
    endSession(roomId, "manual");
    
    // Navigate back to party page
    router.push("/party");
    dispatch(resetPartyState());
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <ChatHeader roomId={roomId} onClose={handleClose} />

      <MessageList
        messages={messages}
        endRef={messagesEndRef}
        isLoading={false}
        currentUsername={username}
      />

      <ChatInput onSend={handleSend} isUploading={uploading} uploadError={uploadError} />
    </div>
  );
};