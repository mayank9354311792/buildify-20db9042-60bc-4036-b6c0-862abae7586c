
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plane, Globe, Map, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation: React.FC = () => {
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
      icon: Plane,
    },
    {
      name: 'Xplore',
      path: '/xplore',
      icon: Globe,
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border h-16 flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs transition-colors",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "h-6 w-6 mb-1",
              isActive && "text-primary"
            )} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;