import HeroVideoDialog from "../../magicui/hero-video-dialog";

export function LiveDemoShowcase() {
  return (
    <section className="py-16 bg-background text-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">✨ Live Demo</h2>
        <p className="text-muted-foreground mb-8">
          Watch how easy it is to pick a problem, solve it, and level up.
        </p>

        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/aoWtPYEPPtg" // Use embed URL
          thumbnailSrc="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755188861/Screenshot_2025-08-14_at_21.55.51_huxfa6.png"
          thumbnailAlt="Live demo of solving a problem"
        />
      </div>
    </section>
  );
}
