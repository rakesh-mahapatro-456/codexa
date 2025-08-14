import { useEffect, useRef, useState } from "react";
import { connectSocket } from "@/config/socket.config";
import { useDispatch } from "react-redux";
import { setRoomId, setParticipants, resetPartyState, setPartyStatus } from "@/store/feature/party/partySlice";

export const useRoomChatSocket = (token) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);
    socket.connect();
    socketRef.current = socket;

    const onMatchFound = (data) => {
      console.log("[useRoomChatSocket] Match found:", data);
      dispatch(setRoomId(data.roomId));
      dispatch(setParticipants([data.partnerId]));
      dispatch(setPartyStatus("matched"));
      setMatchData({
        roomId: data.roomId,
        duration: data.duration || 5,
        role: data.role, // Add role to know if asker or helper
        partnerId: data.partnerId
      });
    };

    const onSessionEnded = () => {
      console.log("[useRoomChatSocket] Session ended");
      dispatch(resetPartyState());
      setMatchData(null);
    };

    socket.on("matched", onMatchFound);
    socket.on("session-ended", onSessionEnded);

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      socket.off("matched", onMatchFound);
      socket.off("session-ended", onSessionEnded);
      socket.disconnect();
    };
  }, [token, dispatch]);

  const endSession = (roomId, endedBy) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("end-session", { roomId, endedBy });
    }
  };

  const sendMessage = (message) => {
    socketRef.current?.emit("chat-message", { message });
  };

  const setAvailability = (isAvailable) => {
    socketRef.current?.emit("update-availability", { isAvailable });
  };

  const joinRoom = (roomId) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("join-room", roomId);
    }
  };

  return {
    endSession,
    sendMessage,
    setAvailability,
    joinRoom,
    matchData,
    socketRef,
    clearMatchData: () => setMatchData(null),
  };
};