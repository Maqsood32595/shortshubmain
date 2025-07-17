import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import MyShorts from "@/pages/MyShorts";
import AIEditor from "@/pages/AIEditor";
import Scheduler from "@/pages/Scheduler";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 brand-gradient rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse-slow">
            <i className="fas fa-spinner fa-spin text-white text-sm"></i>
          </div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/dashboard" component={Home} />
      <Route path="/" component={Home} />
      <Route path="/shorts" component={MyShorts} />
      <Route path="/ai" component={AIEditor} />
      <Route path="/scheduler/:id?" component={Scheduler} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
