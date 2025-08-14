import React from 'react';
import { Button } from '@/components/ui/button';
import { GitBranch, Database, ArrowRight, Network, Binary } from 'lucide-react';
import { useRouter } from 'next/router';

export function Hero() {
    const router = useRouter();
    const handleSignupClick = () => {
        router.push('/signup');
    };
  const subjects = [
    { name: 'Arrays', icon: Database, bgColor: 'bg-blue-600', shape: 'rounded-lg' },
    { name: 'Stack', icon: GitBranch, bgColor: 'bg-orange-600', shape: 'rounded-lg' },
    { name: 'Queue', icon: ArrowRight, bgColor: 'bg-purple-600', shape: 'rounded-lg' },
    { name: 'Graphs', icon: Network, bgColor: 'bg-violet-600', shape: 'rounded-lg' },
    { name: 'Trees', icon: Binary, bgColor: 'bg-yellow-600', shape: 'rounded-full' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Main Hero Section */}
        <div className="text-center mb-5 relative">
          {/* Decorative Elements */}
          <div className="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-8">
            <div className="relative">
              {/* Chart bars */}
              <div className="flex items-end space-x-1 mb-2">
                <div className="w-3 h-8 bg-purple-200 dark:bg-purple-800 rounded-sm"></div>
                <div className="w-3 h-12 bg-purple-300 dark:bg-purple-700 rounded-sm"></div>
                <div className="w-3 h-6 bg-purple-400 dark:bg-purple-600 rounded-sm"></div>
                <div className="w-3 h-10 bg-purple-500 dark:bg-purple-500 rounded-sm"></div>
              </div>
              {/* Code icon */}
              <div className="absolute -left-4 top-4 w-6 h-6 bg-foreground rounded flex items-center justify-center">
                <span className="text-background text-xs">{'<>'}</span>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="relative z-10 mb-8 pt-16">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 text-foreground leading-none relative">
              <span className="relative inline-block">
                Code
                {/* Decorative line under Code */}
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-foreground"></div>
              </span>
            </h1>
            <h1 className="text-6xl md:text-8xl font-bold mb-4 text-foreground leading-none relative">
              <span className="relative inline-block">
                Solve
              </span>
            </h1>
            <h1 className="text-6xl md:text-8xl font-bold text-foreground leading-none relative">
              <span className="relative inline-block">
                Level Up
                {/* Decorative line under Level Up */}
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-foreground"></div>
                {/* Arrow */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-0.5 bg-foreground"></div>
                  <div className="absolute right-0 top-0 w-2 h-2 border-r-2 border-t-2 border-foreground transform rotate-45 -translate-y-1"></div>
                </div>
                {/* Blue dot */}
                <div className="absolute -right-12 -top-4 w-3 h-3 bg-blue-500 rounded-full"></div>
              </span>
            </h1>
          </div>
          
          {/* Subheading */}
          <div className="mb-8">
            <p className="text-xl text-muted-foreground mb-2">
              Practice DSA, earn XP, and track your progress.
            </p>
            <p className="text-xl text-muted-foreground">
              Get smarter in 15 minutes a day.
            </p>
          </div>
          
          {/* CTA Button */}
          <Button size="lg" className="px-8 py-3 text-lg rounded-full mb-6 bg-green-500" onClick={handleSignupClick}>
            Get started
          </Button>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-border mb-6"></div>

        {/* Subjects Section */}
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {subjects.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 ${subject.shape} ${subject.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-base font-medium text-muted-foreground whitespace-nowrap">{subject.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}