import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { UserButton, useUser } from "@clerk/clerk-react";
import { GlassCard } from '../ui/GlassCard';
import { Logo } from '../ui/Logo'; // Import the new logo
import { cn } from '../../lib/utils';

interface NavbarProps {
  status: string;
  step: number;
}

export const Navbar = ({ status, step }: NavbarProps) => {
  const { isSignedIn } = useUser();

  return (
    <header className="relative z-50 w-full max-w-6xl mx-auto p-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* New Custom Logo */}
        <div className="p-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 duration-300">
          <Logo size={28} />
        </div>
        
        <div>
          <h1 className="font-['Dancing_Script'] text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white/80 tracking-wide">
            Doctype.io
          </h1>
          <div className="flex items-center gap-1.5 -mt-1 ml-1">
            <div className={`w-1.5 h-1.5 rounded-full ${status === "Online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`} />
            <span className="text-[10px] font-sans font-medium uppercase text-white/40 tracking-widest">{status}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {isSignedIn && (
          <>
            <GlassCard className="hidden md:flex items-center gap-1 px-2 py-1.5 bg-black/40 border-white/5">
              {['Upload', 'Analyze', 'Chat'].map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium transition-all duration-500",
                    step === i + 1 
                      ? "bg-white text-black shadow-lg scale-105" 
                      : step > i + 1 
                        ? "text-green-400" 
                        : "text-white/20"
                  )}>
                    {step > i + 1 ? <CheckCircle2 size={12} /> : i + 1} {label}
                  </div>
                  {i < 2 && <ChevronRight size={12} className="text-white/10 mx-1" />}
                </div>
              ))}
            </GlassCard>
            
            <div className="h-10 w-10 rounded-full bg-white/10 p-1 border border-white/10 backdrop-blur-md">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-full h-full"
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
};