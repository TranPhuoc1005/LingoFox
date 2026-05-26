import { FloatingParticles } from "@/components/effects/FloatingParticles";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden flex items-center justify-center p-6">
      <FloatingParticles count={10} />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
