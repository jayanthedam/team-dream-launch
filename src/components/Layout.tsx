
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home,
  Lightbulb, 
  Briefcase, 
  MessageCircle, 
  User, 
  LogOut, 
  Users,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import GlobalSearch from './GlobalSearch';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Ideas', href: '/ideas', icon: Lightbulb },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Teams', href: '/teams', icon: Users },
  ];

  const userNavigation = user ? [
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ] : [];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 hidden sm:block">InnovateTogether</span>
                </div>
              </Link>
            </div>

            {/* Search - Desktop */}
            <div className="hidden md:flex md:items-center md:flex-1 md:max-w-sm md:mx-6">
              <GlobalSearch />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-[60px] ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-1">
              {user ? (
                <>
                  {/* Desktop User Navigation */}
                  <div className="hidden lg:flex lg:items-center lg:space-x-2">
                    {userNavigation.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-[60px] ${
                            isActive
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden lg:flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-w-[60px] h-auto"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </Button>

                  {/* User Avatar and Menu */}
                  <div className="flex items-center space-x-2">
                    <Link to="/profile">
                      <div className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-w-[60px] h-auto cursor-pointer">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium">
                            {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : user.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:block">Me</span>
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="hidden md:flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-w-[60px] h-auto"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden lg:block">Sign Out</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-medium">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden px-0 pb-3">
            <GlobalSearch />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden border-t border-slate-100 pt-2 pb-2">
            <div className="flex justify-around">
              {[...navigation, ...userNavigation].map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-blue-700'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
