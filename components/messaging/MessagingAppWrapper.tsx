"use client";
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const MessagingAppComponent = dynamic(
  () => import('./MessagingApp').then(mod => ({ default: mod.MessagingApp })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {/* Manga background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-black transform rotate-12"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border-2 border-black transform -rotate-12"></div>
          <div className="absolute bottom-20 left-32 w-28 h-28 border-2 border-black transform rotate-45"></div>
          <div className="absolute bottom-40 right-10 w-20 h-20 border-2 border-black transform -rotate-45"></div>
        </div>

        {/* Main comic card */}
        <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md mx-4 transform hover:scale-105 transition-transform duration-300">
          {/* Comic panel border effect */}
          <div className="absolute -top-2 -left-2 w-full h-full bg-gray-800 -z-10"></div>
          
          {/* Speed lines background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/2 w-px h-full bg-black opacity-20 transform -rotate-12 animate-pulse"></div>
            <div className="absolute top-0 left-1/3 w-px h-full bg-black opacity-20 transform -rotate-6 animate-pulse"></div>
            <div className="absolute top-0 left-2/3 w-px h-full bg-black opacity-20 transform rotate-6 animate-pulse"></div>
            <div className="absolute top-0 right-1/3 w-px h-full bg-black opacity-20 transform rotate-12 animate-pulse"></div>
          </div>

          <div className="text-center relative z-10">
            {/* Anime-style loading spinner with screentone effect */}
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-black border-t-transparent mx-auto relative">
                {/* Screentone pattern inside spinner */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-60"></div>
              </div>
              {/* Speed lines around spinner */}
              <div className="absolute inset-0 animate-pulse">
                <div className="absolute top-1/2 left-0 w-8 h-px bg-black transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-0 w-8 h-px bg-black transform -translate-y-1/2"></div>
                <div className="absolute top-0 left-1/2 w-px h-8 bg-black transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-px h-8 bg-black transform -translate-x-1/2"></div>
              </div>
            </div>

            {/* Comic speech bubble style title */}
            <div className="relative mb-6">
              <div className="bg-white border-3 border-black rounded-2xl p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {/* Speech bubble tail */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-5 border-l-transparent border-r-transparent border-t-white"></div>
                
                <h2 className="text-3xl font-black text-black mb-2 tracking-wider transform -skew-x-6">
                  🎮 ANIME HUB
                </h2>
                <div className="flex justify-center space-x-1">
                  <span className="text-lg font-bold">⭐</span>
                  <span className="text-lg font-bold">⭐</span>
                  <span className="text-lg font-bold">⭐</span>
                </div>
              </div>
            </div>

            {/* Loading text in comic style */}
            <div className="bg-gray-900 text-white px-6 py-3 border-2 border-black transform -skew-x-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
              <p className="font-bold text-lg tracking-wider animate-pulse transform skew-x-3">
                CONNECTING TO METAVERSE...
              </p>
            </div>

            {/* Manga-style loading dots */}
            <div className="flex justify-center space-x-3">
              <div className="relative">
                <div className="w-4 h-4 bg-black rounded-full animate-bounce"></div>
                <div className="absolute inset-0 w-4 h-4 border-2 border-black rounded-full animate-ping"></div>
              </div>
              <div className="relative" style={{animationDelay: '0.2s'}}>
                <div className="w-4 h-4 bg-black rounded-full animate-bounce"></div>
                <div className="absolute inset-0 w-4 h-4 border-2 border-black rounded-full animate-ping"></div>
              </div>
              <div className="relative" style={{animationDelay: '0.4s'}}>
                <div className="w-4 h-4 bg-black rounded-full animate-bounce"></div>
                <div className="absolute inset-0 w-4 h-4 border-2 border-black rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Action lines effect */}
            <div className="absolute -inset-4 opacity-30 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-black transform rotate-12 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-full h-px bg-black transform -rotate-12 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-black transform -rotate-12 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-full h-px bg-black transform rotate-12 animate-pulse"></div>
            </div>
          </div>

          {/* Comic panel corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-black"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-black"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-black"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-black"></div>
        </div>

        {/* Floating comic elements */}
        <div className="absolute top-20 left-20 animate-bounce">
          <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-sm font-bold">POW!</span>
          </div>
        </div>
        
        <div className="absolute bottom-32 right-32 animate-bounce" style={{animationDelay: '0.3s'}}>
          <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-sm font-bold">ZOOM!</span>
          </div>
        </div>

        <div className="absolute top-1/3 right-20 animate-pulse">
          <div className="bg-white border-2 border-black px-2 py-1 transform rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-bold">⚡</span>
          </div>
        </div>
      </div>
    ),
  }
);

export default MessagingAppComponent;