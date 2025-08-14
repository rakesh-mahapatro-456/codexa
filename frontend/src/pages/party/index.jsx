import React, { useState, useEffect } from "react";
import UserLayout from "@/components/layout/UserLayout";
import { AskHelpForm } from "@/components/custom/instantSolve/AskHelpForm";
import { InfoCardXp } from "@/components/custom/instantSolve/InfoCardXp";
import { AvailabilityCard } from "@/components/custom/instantSolve/AvailabilityCard";
import { LoaderThree } from "@/components/ui/loader";
import { MatchedModal } from "@/components/custom/instantSolve/MatchedModal";
import { useSelector, useDispatch } from "react-redux";
import { useRoomChatSocket } from "@/components/custom/hook/useRoomChatSocket";
import { askHelp } from "@/store/feature/party/partyThunk";
import { resetPartyState } from "@/store/feature/party/partySlice";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Party() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const partyState = useSelector((state) => state.party);
  const { matchData, clearMatchData, setAvailability, socketRef } = useRoomChatSocket(token);
  const [isAvailable, setIsAvailable] = useState(false);

  // Remove duplicate socket listeners - let useRoomChatSocket handle them
  useEffect(() => {
    console.log("[Party] partyState:", partyState);
    console.log("[Party] matchData:", matchData);
  }, [partyState, matchData]);

  const handleHelpRequest = async (duration) => {
    try {
      const result = await dispatch(askHelp({ duration, currentUserId: user._id }));
      if (askHelp.fulfilled.match(result)) {
        toast("Help request sent! Waiting for a helper...");
      } else {
        toast("Failed to find a helper: " + (result.payload || "Unknown error"));
      }
    } catch (error) {
      toast("Failed to find a helper: " + error.message);
    }
  };

  const handleToggleAvailability = (status) => {
    setIsAvailable(status);
    setAvailability(status);
  };

  const handleModalClose = () => {
    console.log("[Party] Modal closed - clearing match data and resetting party state");
    clearMatchData();
    dispatch(resetPartyState());
  };

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className="w-full flex justify-center py-8">
          <div className="flex flex-col lg:flex-row gap-6 max-w-4xl w-full px-4">
            {/* Left Column - InfoCard */}
            <div className="flex-shrink-0 w-full lg:w-80">
              <InfoCardXp />
            </div>

            {/* Right Column - Main Content */}
            <div className="flex-1 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col space-y-6">
                {false ? (
                  <div className="flex justify-center items-center h-64">
                    <LoaderThree />
                  </div>
                ) : (
                  <AskHelpForm onSubmit={handleHelpRequest} />
                )}
                <AvailabilityCard isAvailable={isAvailable} onToggle={handleToggleAvailability} />
              </div>
            </div>
          </div>

          {/* Use matchData from hook instead of partyState */}
          <MatchedModal
            open={!!matchData}
            onClose={handleModalClose}
            roomId={matchData?.roomId}
            duration={matchData?.duration || 5}
            role={matchData?.role}
          />
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}