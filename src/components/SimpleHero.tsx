import Link from "./Link";

function SimpleHero() {
  return (
    <section className="relative overflow-hidden w-screen mt-[-1px]">
      {/* 背景渐变 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/90 to-primary/30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      </div>

      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white-950 bg-clip-text [text-wrap:balance]">
            Master Your Time, Elevate Your Growth
          </h1>

          <p className="text-xl text-primary-foreground">
            Discover tools and resources to manage your time, grow personally,
            and boost efficiency.
          </p>

          <div className="flex justify-center gap-4">
            <button className="group relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/pomodoro">
                <span className="relative z-10">Get Started</span>
              </Link>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-foreground/20 to-primary-foreground/10 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
            </button>
          </div>
        </div>

        {/* 底部装饰 */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-indigo-600/90 to-transparent" /> */}
      </div>
    </section>
  );
}

export default SimpleHero;
