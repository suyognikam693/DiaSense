import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { HomePage } from './HomePage';
import { ContactDoctorPage } from './ContactDoctorPage';
import { DietPlannerPage } from './DietPlannerPage';
import { ProfilePage } from './ProfilePage';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Activity, Home, Stethoscope, Utensils, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Dashboard({ user, onLogout, onUpdateUserData, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Listen for navigation to profile event
  useEffect(() => {
    const handleNavigateToProfile = () => {
      navigate('/profile');
    };
    
    window.addEventListener('navigate-to-profile', handleNavigateToProfile);
    return () => window.removeEventListener('navigate-to-profile', handleNavigateToProfile);
  }, [navigate]);

  const navigation = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/contact-doctor', name: 'Contact Doctor', icon: Stethoscope },
    { path: '/diet-planner', name: 'Diet Planner', icon: Utensils },
  ];

  const NavItems = ({ mobile = false }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              if (mobile) setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-lg scale-105'
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
            } ${mobile ? 'w-full' : ''}`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-2 rounded-2xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">DiaSense</h1>
                <p className="text-gray-500 text-sm">✨ Welcome, {user.name}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <NavItems />
            </nav>

            {/* Mobile Menu & Profile */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col gap-4 mt-8">
                    <NavItems mobile />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative group focus:outline-none">
                    <Avatar className="w-10 h-10 border-2 border-purple-200 group-hover:border-purple-400 transition-colors cursor-pointer">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {user.riskScore !== undefined && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${
                          user.riskScore < 25 ? 'bg-green-500' :
                          user.riskScore < 50 ? 'bg-yellow-500' :
                          user.riskScore < 75 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content mapped to Router Routes */}
      <main>
        <Routes>
          <Route 
            path="/" 
            element={<HomePage user={user} onUpdateUserData={onUpdateUserData} />} 
          />
          <Route 
            path="/contact-doctor" 
            element={<ContactDoctorPage user={user} />} 
          />
          <Route 
            path="/diet-planner" 
            element={<DietPlannerPage user={user} />} 
          />
          <Route 
            path="/profile" 
            element={
              <ProfilePage 
                user={user} 
                onUpdateUserData={onUpdateUserData} 
                setUser={setUser} 
                onNavigateToHome={() => navigate('/')} 
              />
            } 
          />
          {/* Fallback route in case of 404 */}
          <Route 
            path="*" 
            element={<HomePage user={user} onUpdateUserData={onUpdateUserData} />} 
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500 text-sm">
            This tool is for educational purposes only and should not replace professional medical advice.
            Please consult with a healthcare provider for accurate diagnosis and treatment.
          </p>
        </div>
      </footer>
    </div>
  );
}