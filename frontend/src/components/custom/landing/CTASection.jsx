import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"

export function CTASection() {
    const router = useRouter();
    const handleSignupClick = () => {
        router.push('/signup');
    };
  return (
    <section className="w-full py-16 bg-primary text-primary-foreground text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Start Your Coding Journey?</h2>
      <p className="text-lg mb-8">Join now and solve problems every day to level up your skills.</p>
      <div className="flex justify-center">
        <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleSignupClick}>
          Start Coding
        </Button>
      </div>
    </section>
  )
}
