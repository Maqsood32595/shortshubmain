import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/", icon: "fas fa-home", label: "Home" },
    { path: "/shorts", icon: "fas fa-video", label: "My Shorts" },
    { path: "/ai", icon: "fas fa-magic", label: "AI Create" },
    { path: "/scheduler", icon: "fas fa-calendar-alt", label: "Schedule" },
    { path: "/profile", icon: "fas fa-user", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <button 
              className={`flex flex-col items-center space-y-1 px-4 py-2 transition-colors ${
                isActive(item.path) 
                  ? "text-blue-600" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <i className={`${item.icon} text-lg`}></i>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: "fas fa-home", label: "Home" },
    { href: "/shorts", icon: "fas fa-video", label: "Shorts" },
    { href: "/ai", icon: "fas fa-magic", label: "AI Create" },
    { href: "/scheduler", icon: "fas fa-calendar-alt", label: "Schedule" },
    { href: "/profile", icon: "fas fa-user", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <i className={`${item.icon} text-lg mb-1`}></i>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
