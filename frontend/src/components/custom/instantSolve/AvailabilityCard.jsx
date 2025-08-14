import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserCheck, Clock, Heart } from "lucide-react";

export const AvailabilityCard = ({ isAvailable, onToggle }) => {
  const handleToggle = () => {
    onToggle(!isAvailable);
  };

  return (
    <Card className="w-full max-w-md p-4 mb-4">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className={`h-5 w-5 ${isAvailable ? 'text-green-500' : 'text-gray-400'}`} />
              <h2 className="text-lg font-semibold">Helper Status</h2>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                You are currently {isAvailable ? (
                  <span className="text-green-600">Available to Help 🟢</span>
                ) : (
                  <span className="text-gray-500">Not Available 🔴</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAvailable 
                  ? "Others can request your help for free" 
                  : "You won't receive help requests"
                }
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Switch 
              checked={isAvailable} 
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-green-500"
            />
            <Label className="text-xs text-center">
              {isAvailable ? "ON" : "OFF"}
            </Label>
          </div>
        </div>

        {isAvailable && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Ready to help! 💚</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              You'll be notified when someone needs assistance
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};