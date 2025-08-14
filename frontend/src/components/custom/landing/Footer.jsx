export function Footer() {
    return (
      <footer className="w-full border-t bg-background py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Codexa. All rights reserved.
          </div>
        </div>
      </footer>
    )
  }
  