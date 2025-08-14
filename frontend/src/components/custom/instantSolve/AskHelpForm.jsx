import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Users, Heart } from "lucide-react";
import { toast } from "sonner";

export const AskHelpForm = ({ onSubmit, disabled = false }) => {
  const [duration, setDuration] = useState("5");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      await onSubmit(Number(duration));
      toast(`Looking for helpers for ${duration} minute session`);
    } catch (error) {
      toast("Failed to find help: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-4">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Need Instant Help?
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connect with available helpers for free assistance
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Help Duration:</Label>
            <RadioGroup 
              defaultValue={duration} 
              onValueChange={setDuration} 
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="5" id="r1" />
                <Label htmlFor="r1" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="font-medium">5 Minutes</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Quick question or doubt</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Free
                    </span>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="10" id="r2" />
                <Label htmlFor="r2" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">10 Minutes</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Detailed explanation needed</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Free
                    </span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || disabled}
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Finding Helper...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Request Help
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              🌟 Free community help • No charges • Instant matching
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};