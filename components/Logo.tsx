"use client";

import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <Link href="/dashboard/creator" className={`group inline-flex items-center font-bold tracking-tight ${className}`} dir="ltr">
            <style jsx>{`
        @keyframes eye-movement {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(0, -15%); }
          15% { transform: translate(0, 0); }
          40% { transform: translate(0, 0); }
          45% { transform: translate(-10%, 0); }
          55% { transform: translate(-10%, 0); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(15%, 0); }
          75% { transform: translate(0, 0); }
        }
        .animate-eyes { display: inline-block; animation: eye-movement 5s ease-in-out infinite; }
        .delay-slight { animation-delay: 0.05s; }
      `}</style>
            <span className="text-[#8CAB46] flex items-baseline">
                n<span className="animate-eyes mx-[0.05em]">o</span>
                <span className="animate-eyes delay-slight mx-[0.05em]">O</span>r
            </span>
            <span className="relative flex items-center overflow-hidden h-[1.2em] w-[2.7em] ml-[0.05em]">
                <span className="absolute inset-0 flex items-center text-[#E6C65D] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-[100%] group-hover:opacity-0">Space</span>
                <span className="absolute inset-0 flex items-center justify-start text-[#E6C65D] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] -translate-y-[100%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    🛸
                </span>
            </span>
        </Link>
    );
}