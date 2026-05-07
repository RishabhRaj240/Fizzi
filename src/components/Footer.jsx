import React from 'react';

export default function Footer() {
  return (
    <footer className="relative bg-[#0d0d0d] py-32 overflow-hidden border-t border-white/10 z-10">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* Simple star/sparkle background using radial gradients */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-[#FF2D78] rounded-full shadow-[0_0_15px_#FF2D78]"></div>
        <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-[#00C9A7] rounded-full shadow-[0_0_20px_#00C9A7]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-10 text-center relative z-20">
        <h2 className="text-6xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D78] to-[#00C9A7] mb-10 leading-tight">
          Soda that<br/>makes you Smile
        </h2>
        
        <div className="flex justify-center gap-8 mb-20 font-label-bold tracking-widest text-sm uppercase">
          <a href="#" className="text-white/60 hover:text-white transition-colors">Instagram</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">TikTok</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Twitter</a>
        </div>
        
        <p className="font-body text-white/40">© 2026 Fizzi Soda. Pop Responsibly.</p>
      </div>
    </footer>
  );
}
