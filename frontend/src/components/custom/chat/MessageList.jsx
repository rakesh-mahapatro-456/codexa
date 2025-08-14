import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { Skeleton } from "@/components/ui/skeleton";

const isSameSender = (curr, prev) => {
  if (!prev) return false;
  return curr.sender === prev.sender;
};

const shouldShowSender = (curr, prev) => {
  if (!prev) return true;
  return curr.sender !== prev.sender;
};

const formatDayDivider = (date) => {
  const today = new Date();
  const messageDate = new Date(date);
  const isToday = today.toDateString() === messageDate.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = yesterday.toDateString() === messageDate.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return messageDate.toLocaleDateString();
};

export const MessageList = ({ 
  messages, 
  endRef, 
  isLoading, 
  currentUsername 
}) => {
  let lastDate = null;

  return (
    <ScrollArea className="flex-1 p-4 space-y-2 overflow-y-auto">
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex space-x-2 items-start">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full max-w-xs rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const prevMsg = messages[idx - 1];
          
          const showDateDivider =
            !lastDate ||
            new Date(msg.timestamp).toDateString() !==
              new Date(lastDate).toDateString();

          const dateDivider = showDateDivider
            ? formatDayDivider(msg.timestamp)
            : null;

          const showSender = shouldShowSender(msg, prevMsg);
          const isOwn = msg.sender === currentUsername || msg.own;
          
          lastDate = msg.timestamp;

          return (
            <div key={idx} className="space-y-2">
              {/* Date Divider */}
              {dateDivider && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                    {dateDivider}
                  </div>
                </div>
              )}
              
              {/* Message Bubble */}
              <MessageBubble
                message={msg}
                isOwn={isOwn}
                sender={msg.sender || "Unknown User"}
                showSender={showSender && !isOwn}
              />
            </div>
          );
        })
      )}
      
      {/* Scroll anchor */}
      <div ref={endRef} />
    </ScrollArea>
  );
};