import { useState, useEffect } from 'react';
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
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Listen for navigation to profile event
  useEffect(() => {
    const handleNavigateToProfile = () => {
      setCurrentPage('profile');
    };
    
    window.addEventListener('navigate-to-profile', handleNavigateToProfile);
    return () => window.removeEventListener('navigate-to-profile', handleNavigateToProfile);
  }, []);

  const navigation = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'contact-doctor', name: 'Contact Doctor', icon: Stethoscope },
    { id: 'diet-planner', name: 'Diet Planner', icon: Utensils },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage user={user} onUpdateUserData={onUpdateUserData} />;
      case 'contact-doctor':
        return <ContactDoctorPage user={user} />;
      case 'diet-planner':
        return <DietPlannerPage user={user} />;
      case 'profile':
        return <ProfilePage user={user} onUpdateUserData={onUpdateUserData} setUser={setUser} onNavigateToHome={() => setCurrentPage('home')} />;
      default:
        return <HomePage user={user} onUpdateUserData={onUpdateUserData} />;
    }
  };

  const NavItems = ({ mobile = false }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setCurrentPage(item.id);
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
                <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">DiaSense</h1>
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
                  <button className="relative group">
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
                      <p>{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentPage('profile')}>
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderPage()}
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