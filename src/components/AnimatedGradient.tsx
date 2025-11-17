"use client";

// Simplified gradient - uses CSS animations instead of JS for better performance
const AnimatedGradient = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Static gradients - no JS animation overhead */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sensual-rose/10 rounded-full blur-[150px] opacity-80" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-passion-flame/5 rounded-full blur-[180px]" />
    </div>
  );
};

export default AnimatedGradient;
