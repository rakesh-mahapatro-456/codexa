import React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Trophy, Calendar, Smartphone, TrendingUp, Users, Code, Zap, Target } from "lucide-react";

export function Feature() {
  const features = [
    {
      title: "Track Your Progress",
      description:
        "Monitor your XP and levels as you solve coding challenges in real-time. Watch your skills grow with detailed analytics.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Daily Challenges",
      description:
        "Complete daily coding quests to earn bonus XP and keep your streak alive. Never miss a day of learning.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Smart Learning Path",
      description:
        "Get targeted problem recommendations based on your progress and skill level. Learn efficiently with curated DSA topics.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Community Collaboration",
      description:
        "Get instant help from peers or help others solve problems. Earn XP by collaborating and sharing knowledge.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];

  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Level up your coding skills
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          From beginner arrays to advanced algorithms, our platform provides everything you need to master Data Structures and Algorithms in just 15 minutes a day.
        </p>
      </div>
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ children, className }) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }) => {
  return (
    <p className={cn(
      "text-sm md:text-base max-w-4xl text-left mx-auto",
      "text-neutral-500 text-center font-normal dark:text-neutral-300",
      "text-left max-w-sm mx-0 md:text-sm my-2"
    )}>
      {children}
    </p>
  );
};

// Dashboard Progress Screenshot
export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-3 mx-auto bg-transparent shadow-2xl group h-full rounded-lg overflow-hidden">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          {/* Your actual dashboard screenshot */}
          <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-800">
            {/* <img 
              src="" 
              alt="Dashboard Progress Tracking"
              className="w-full h-full object-cover object-top"
              style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                minHeight: '200px'
              }}
            /> */}
            {/* Overlay showing key dashboard elements */}
            <div className="absolute inset-4 pointer-events-none">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 text-xs font-bold">R</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Welcome back,</p>
                      <p className="text-blue-400 text-sm font-semibold">rakesh</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                  <p className="text-gray-400 text-xs">Level</p>
                  <p className="text-white text-2xl font-bold">6</p>
                  <p className="text-green-400 text-xs">XP: 360</p>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 text-lg font-bold">1</span>
                  </div>
                  <p className="text-gray-400 text-xs">Day Streak</p>
                </div>
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center relative">
                      <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">12</span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">/ 368</span>
                  </div>
                  <p className="text-gray-400 text-xs">PROBLEMS SOLVED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

// Streak Calendar Screenshot
export const SkeletonTwo = () => {
  return (
    <div className="relative flex flex-col items-center p-6 gap-6 h-full overflow-hidden">
      <div className="w-full max-w-sm bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🔥</span>
            <h3 className="text-xl font-bold text-white">Streak Calendar</h3>
          </div>
          <div className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            🔥 0 days
          </div>
        </div>
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button className="text-gray-400 hover:text-white">
            <span>‹</span>
          </button>
          <h4 className="text-white font-semibold">August 2025</h4>
          <button className="text-gray-400 hover:text-white">
            <span>›</span>
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-gray-400 text-xs py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar dates */}
          {Array.from({length: 35}, (_, i) => {
            const date = i - 3; // Starting from July 28
            const isCurrentMonth = date >= 1 && date <= 31;
            const isToday = date === 14;
            const isStreakDay = date === 13;
            
            return (
              <div 
                key={i} 
                className={cn(
                  "w-6 h-6 flex items-center justify-center text-xs rounded",
                  isCurrentMonth ? "text-white" : "text-gray-600",
                  isToday ? "bg-gray-600" : "",
                  isStreakDay ? "bg-green-500" : "",
                  !isCurrentMonth && "opacity-50"
                )}
              >
                {date > 0 && date <= 31 ? date : date <= 0 ? 31 + date : date - 31}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-400">Streak Day</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-600 rounded"></div>
            <span className="text-gray-400">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// DSA Topics Screenshot
export const SkeletonThree = () => {
  return (
    <div className="relative flex gap-10 h-full group/topics p-6">
      <div className="w-full mx-auto bg-transparent group h-full">
        <div className="w-full bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl h-full overflow-hidden">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">DSA Sheet - Topics</h3>
            <div className="w-full bg-gray-800 rounded-lg px-4 py-2 mb-4">
              <input 
                type="text" 
                placeholder="Search questions..." 
                className="w-full bg-transparent text-gray-400 text-sm outline-none"
                readOnly
              />
            </div>
          </div>
          
          {/* Topics List */}
          <div className="space-y-2">
            <div className="bg-purple-600 text-white p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>▷</span>
                <span className="font-semibold">Arrays</span>
                <span className="text-purple-200 text-sm">(26 questions)</span>
              </div>
            </div>
            
            <div className="bg-gray-800 text-gray-300 p-4 rounded-lg flex items-center justify-between hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-3">
                <span>▷</span>
                <span className="font-semibold">Strings</span>
                <span className="text-gray-400 text-sm">(21 questions)</span>
              </div>
            </div>
            
            <div className="bg-gray-800 text-gray-300 p-4 rounded-lg flex items-center justify-between hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-3">
                <span>▷</span>
                <span className="font-semibold">2D Arrays</span>
                <span className="text-gray-400 text-sm">(10 questions)</span>
              </div>
            </div>
            
            <div className="bg-gray-800 text-gray-300 p-4 rounded-lg flex items-center justify-between hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-3">
                <span>▷</span>
                <span className="font-semibold">Searching & Sorting</span>
                <span className="text-gray-400 text-sm">(23 questions)</span>
              </div>
            </div>
            
            <div className="bg-gray-800 text-gray-300 p-4 rounded-lg flex items-center justify-between hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-3">
                <span>▷</span>
                <span className="font-semibold">Backtracking</span>
                <span className="text-gray-400 text-sm">(21 questions)</span>
              </div>
            </div>
          </div>
          
          {/* Recommendation badge */}
          <div className="mt-6 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Recommended: Start with Arrays</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Community Party Page Screenshot
// Community Party Page Screenshot
export const SkeletonFour = () => {
  return (
    <div className="w-full flex justify-center bg-transparent p-6">
      <div className="flex gap-6 max-w-4xl w-full">
        {/* Left Column - InfoCard */}
        <div className="flex-shrink-0 w-80">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 text-white">
                <Users className="h-5 w-5 text-blue-400" />
                Welcome to Community Help! 🎉
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Connect with fellow students for instant help with DSA problems. Our community-driven platform offers free peer-to-peer assistance.
              </p>
            </div>
            
            {/* Feature Cards */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-950/50 rounded-lg border border-blue-900/50">
                <div className="w-5 h-5 text-blue-400 mt-0.5">💬</div>
                <div>
                  <h4 className="font-medium text-sm text-blue-100">Get Help</h4>
                  <p className="text-xs text-blue-300">Request assistance from available helpers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-950/50 rounded-lg border border-green-900/50">
                <div className="w-5 h-5 text-green-400 mt-0.5">❤️</div>
                <div>
                  <h4 className="font-medium text-sm text-green-100">Help Others</h4>
                  <p className="text-xs text-green-300">Share your knowledge and help fellow students</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-950/50 rounded-lg border border-purple-900/50">
                <div className="w-5 h-5 text-purple-400 mt-0.5">⚡</div>
                <div>
                  <h4 className="font-medium text-sm text-purple-100">Instant Matching</h4>
                  <p className="text-xs text-purple-300">Quick connection with available helpers</p>
                </div>
              </div>
            </div>
 
            {/* How it works */}
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border-l-4 border-yellow-400">
              <h5 className="font-medium text-sm text-white mb-1">How it works:</h5>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Choose session duration (5 or 10 minutes)</li>
                <li>• Get matched with an available helper instantly</li>
                <li>• Chat and solve problems together</li>
                <li>• Completely free - community powered!</li>
              </ul>
            </div>
          </div>
        </div>
 
        {/* Right Column - Help Forms */}
        <div className="flex-1 max-w-md">
          <div className="space-y-6">
            {/* Help Request Card */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  🤝 Need Instant Help?
                </h3>
                <p className="text-gray-400 text-sm">
                  Connect with available helpers for free assistance
                </p>
              </div>
 
              <div className="mb-4">
                <p className="text-white text-sm font-medium mb-3">Select Help Duration:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">5 Minutes</span>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Free</span>
                      </div>
                      <p className="text-gray-400 text-xs">Quick question or doubt</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 opacity-60">
                    <div className="w-4 h-4 border-2 border-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 text-sm">10 Minutes</span>
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Free</span>
                      </div>
                      <p className="text-gray-500 text-xs">Detailed explanation needed</p>
                    </div>
                  </div>
                </div>
              </div>
 
              <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-white transition-colors flex items-center justify-center gap-2">
                ❤️ Request Help
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-3">
                ⭐ Free community help • No charges • Instant matching
              </p>
            </div>
 
            {/* Helper Status Card */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                    👤 Helper Status
                  </h4>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    You are currently <span className="text-red-400">Not Available</span> 🔴
                  </p>
                  <p className="text-gray-500 text-xs">You won't receive help requests</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-12 h-6 bg-gray-600 rounded-full relative mb-1">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                  </div>
                  <span className="text-gray-400 text-xs">OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 };