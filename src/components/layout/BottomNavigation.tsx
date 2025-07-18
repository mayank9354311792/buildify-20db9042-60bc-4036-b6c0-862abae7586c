
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Map, User, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Build Buddy',
      path: '/',
      icon: Home,
    },
    {
      name: 'Book',
      path: '/book',
      icon: BookOpen,
    },
    {
      name: 'Xplore',
      path: '/xplore',
      icon: Compass,
    },
    {
      name: 'My Trips',
      path: '/my-trips',
      icon: Map,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon size={20} className={cn(isActive ? 'animate-pulse' : '')} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;