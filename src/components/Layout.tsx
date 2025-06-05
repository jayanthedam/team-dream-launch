
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Lightbulb, 
  Briefcase, 
  MessageCircle, 
  User, 
  LogOut, 
  Menu,
  Users,
  Search as SearchIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import GlobalSearch from './GlobalSearch';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Ideas', href: '/ideas', icon: Lightbulb },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Search', href: '/search', icon: SearchIcon },
  ];

  const userNavigation = user ? [
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ] : [];

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">InnovateTogether</span>
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActivePath(item.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Global Search - Desktop */}
            <div className="hidden md:flex md:items-center md:flex-1 md:max-w-md md:mx-8">
              <GlobalSearch />
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* User Navigation */}
                  <div className="hidden md:flex md:space-x-2">
                    {userNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`p-2 rounded-md transition-colors ${
                            isActivePath(item.href)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </Link>
                      );
                    })}
                  </div>

                  {/* User Avatar and Logout */}
                  <div className="flex items-center space-x-3">
                    <Link to="/profile">
                      <Avatar className="w-8 h-8 cursor-pointer">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                          {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={signOut}
                      className="hidden md:flex text-slate-600 hover:text-slate-900"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <GlobalSearch />
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
