import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon, Code, CheckCircle, Repeat, Trophy } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Pick a Topic",
      description: "Go to the DSA page, browse the table, and select a topic you want to practice."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Solve Externally",
      description: "Open the problem on platforms like LeetCode or GeeksforGeeks and solve it."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Mark as Solved",
      description: "Come back here and mark the problem as solved to track your progress."
    },
    {
      icon: <Repeat className="w-8 h-8" />,
      title: "Repeat & Challenge",
      description: "Repeat the process and also solve the daily challenge to level up."
    }
  ];

  return (
    <section className="py-12 bg-background text-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="shadow-lg border border-border">
              <CardContent className="flex flex-col items-center p-6 space-y-4">
                {step.icon}
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
