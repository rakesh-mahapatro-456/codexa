import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Clock, MessageCircle } from "lucide-react";

export const InfoCardXp = () => {
  return (
    <Card className="w-full max-w-md p-4 mb-4">
      <CardContent>
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Welcome to Community Help! 🎉
          </h2>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Connect with fellow students for instant help with DSA problems. Our community-driven platform offers free peer-to-peer assistance.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <MessageCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-blue-900 dark:text-blue-100">Get Help</h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">Request assistance from available helpers</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-100 dark:border-green-900/50">
            <Heart className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-green-900 dark:text-green-100">Help Others</h3>
              <p className="text-xs text-green-700 dark:text-green-300">Share your knowledge and help fellow students</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-100 dark:border-purple-900/50">
            <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-purple-900 dark:text-purple-100">Instant Matching</h3>
              <p className="text-xs text-purple-700 dark:text-purple-300">Quick connection with available helpers</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg border-l-4 border-yellow-500 dark:border-yellow-400">
          <h4 className="font-medium text-sm text-foreground mb-1">How it works:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Choose session duration (5 or 10 minutes)</li>
            <li>• Get matched with an available helper instantly</li>
            <li>• Chat and solve problems together</li>
            <li>• Completely free - community powered!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};