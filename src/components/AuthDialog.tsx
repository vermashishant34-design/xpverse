import { useState, useEffect } from "react";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signup, login, loading, error, isAuthenticated, clearError } = useAuth();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [signupData, setSignupData] = useState({ email: "", password: "", confirmPassword: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
      nav("/character");
    }
  }, [isAuthenticated, open, onOpenChange, nav]);

  useEffect(() => {
    clearError();
  }, [open, clearError]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      return;
    }
    await signup(signupData.email, signupData.password || undefined);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginData.email, loginData.password || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong border border-neon-cyan/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
            Welcome to XPVERSE
          </DialogTitle>
          <DialogDescription className="text-center text-neon-cyan">
            Start your journey to level up your life!
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertDescription className="text-red-300 font-mono">{error}</AlertDescription>
          </Alert>
        )}

        <div className="w-full">
          <div className="grid w-full grid-cols-2 bg-background/50 border border-white/10 p-1 rounded-xl items-stretch">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`h-12 rounded-lg flex items-center justify-center transition-all duration-200 font-medium ${
                activeTab === "login"
                  ? "bg-neon-cyan/30 text-neon-cyan font-bold border-2 border-neon-cyan shadow-[0_0_25px_rgba(0,255,255,0.5)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`h-12 rounded-lg flex items-center justify-center transition-all duration-200 font-medium ${
                activeTab === "signup"
                  ? "bg-neon-purple/30 text-neon-purple font-bold border-2 border-neon-purple shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {activeTab === "login" && (
            <div className="mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-neon-cyan">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="border-white/20 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-neon-cyan">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="border-white/20 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 bg-background/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-neon-cyan hover:bg-neon-cyan/90 text-background font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,255,0.3)]" 
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </div>
          )}

          {activeTab === "signup" && (
            <div className="mt-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-neon-purple">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                    className="border-white/20 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-neon-purple">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    className="border-white/20 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-neon-purple">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                    className={`border-white/20 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 bg-background/50 ${
                      signupData.confirmPassword && signupData.password !== signupData.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {signupData.confirmPassword && signupData.password !== signupData.confirmPassword && (
                    <p className="text-red-400 text-xs font-mono">Passwords do not match</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-neon-purple hover:bg-neon-purple/90 text-background font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                  disabled={loading || signupData.password !== signupData.confirmPassword}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
