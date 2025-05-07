import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useLoading } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoginError {
  message: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("demo@captivite.com");
  const [password, setPassword] = React.useState("demo123");
  const [isLoading, setIsLoading] = React.useState(false);

  const setLoading = useLoading((state) => state.setLoading);
  const auth = useAuth();

  // Redirect to the page the user was trying to access, or dashboard by default
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoading(true);
    
    try {
      const { success, requiresMfa } = await auth.login({ email, password });
      if (!success) {
        throw new Error("Login failed");
      }

      if (requiresMfa) {
        navigate("/mfa", { replace: true });
        return;
      }

      navigate(from, { replace: true });
      toast({
        title: "Login successful",
        description: "Welcome to your dashboard",
      });
    } catch (error) {
      const loginError = error as LoginError;
      toast({
        title: "Login failed",
        description: loginError.message || "Please check your credentials and try again",
        variant: "destructive",
      });
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Login to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <a href="#" className="text-primary hover:underline">
            Forgot your password?
          </a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
