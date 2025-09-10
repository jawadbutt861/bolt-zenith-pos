import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (role: 'admin' | 'cashier') => {
    setIsLoading(true);
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Navigate based on role
    if (role === 'admin') {
      navigate('/inventory');
    } else {
      navigate('/cashier');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-neon-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 bg-neon-violet/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 h-32 w-32 bg-neon-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow">
            <Zap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            NeonPOS
          </h1>
          <p className="text-muted-foreground mt-2">
            Next-Gen Point of Sale System
          </p>
        </div>

        <Card className="bg-glass/80 backdrop-blur-xl border-glass-border shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your POS system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cashier" className="space-y-6">
              <TabsList className="grid grid-cols-2 w-full bg-secondary/50">
                <TabsTrigger value="cashier" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Cashier
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cashier" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cashier-email">Email</Label>
                  <Input
                    id="cashier-email"
                    type="email"
                    placeholder="cashier@neonpos.com"
                    className="bg-input border-input-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashier-password">Password</Label>
                  <Input
                    id="cashier-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-input border-input-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <Button
                  onClick={() => handleLogin('cashier')}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-medium"
                >
                  {isLoading ? "Signing in..." : "Sign in as Cashier"}
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@neonpos.com"
                    className="bg-input border-input-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-input border-input-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <Button
                  onClick={() => handleLogin('admin')}
                  disabled={isLoading}
                  className="w-full bg-gradient-warning hover:shadow-warning-glow transition-all duration-300 font-medium"
                >
                  {isLoading ? "Signing in..." : "Sign in as Admin"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Demo Mode - Click any sign in button to continue
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by cutting-edge technology</p>
          <div className="flex justify-center gap-1 mt-2">
            <div className="h-1 w-8 bg-neon-blue rounded-full animate-glow-pulse"></div>
            <div className="h-1 w-8 bg-neon-green rounded-full animate-glow-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="h-1 w-8 bg-neon-violet rounded-full animate-glow-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;