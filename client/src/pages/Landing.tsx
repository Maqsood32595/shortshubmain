import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 brand-gradient rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
            <i className="fas fa-video text-white text-2xl"></i>
          </div>
          
          <h1 className="text-4xl font-bold gradient-text mb-4">
            ShortsHub
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Create viral shorts with AI and schedule across all platforms
          </p>
          
          <Button 
            size="lg" 
            className="brand-gradient text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => window.location.href = "/api/login"}
          >
            <i className="fas fa-rocket mr-2"></i>
            Get Started
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-magic text-white"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Video Generation</h3>
              <p className="text-sm text-gray-600">Create stunning videos from text prompts using advanced AI</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-alt text-white"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
              <p className="text-sm text-gray-600">Schedule to TikTok, Instagram, and YouTube at optimal times</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-white"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
              <p className="text-sm text-gray-600">Track performance and optimize your content strategy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
