import { Outlet, NavLink, useLocation } from 'react-router';
import { Home, Library, User, BatteryFull, Wifi, Signal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { AppProvider } from '../store';

export function Layout() {
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isTabBarVisible = location.pathname === '/' || location.pathname === '/bookshelf' || location.pathname === '/profile';
  const isDarkPage = location.pathname.startsWith('/cover') || location.pathname.startsWith('/knowledge') || location.pathname.startsWith('/category');
  const statusBarTextColor = isDarkPage ? 'text-white' : 'text-gray-900';

  return (
    <AppProvider>
    <div className="flex justify-center items-center min-h-screen bg-gray-200 font-sans sm:py-12">
      {/* Outer Device Frame (Bezels) - Only applied on sm+ screens */}
      <div className="relative mx-auto sm:border-gray-900 sm:bg-gray-900 sm:border-[12px] sm:rounded-[3rem] h-[100dvh] w-full sm:h-[844px] sm:w-[390px] sm:shadow-2xl">
        
        {/* Hardware Buttons - Hidden on mobile */}
        <div className="hidden sm:block w-[3px] h-[32px] bg-gray-800 absolute -left-[15px] top-[112px] rounded-l-md"></div>
        <div className="hidden sm:block w-[3px] h-[64px] bg-gray-800 absolute -left-[15px] top-[178px] rounded-l-md"></div>
        <div className="hidden sm:block w-[3px] h-[64px] bg-gray-800 absolute -left-[15px] top-[256px] rounded-l-md"></div>
        <div className="hidden sm:block w-[3px] h-[96px] bg-gray-800 absolute -right-[15px] top-[200px] rounded-r-md"></div>

        {/* Inner Screen */}
        <div className="relative rounded-none sm:rounded-[2.25rem] overflow-hidden w-full h-full bg-white flex flex-col">
          
          {/* Status Bar */}
          <div className={`h-14 w-full absolute top-0 z-[100] flex items-center justify-between px-6 pointer-events-none transition-colors duration-300 ${statusBarTextColor}`}>
            {/* Time */}
            <div className="w-[54px] flex justify-center pt-2">
              <span className="text-[15px] font-semibold tracking-tight">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            </div>

            {/* Dynamic Island / Notch Area */}
            <div className="absolute left-1/2 top-3 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full flex items-center justify-end px-3 shadow-sm">
              <div className="w-2.5 h-2.5 bg-[#141414] rounded-full shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]"></div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1.5 pt-2 pr-1">
              <Signal className="w-4 h-4" strokeWidth={2.5} />
              <Wifi className="w-4 h-4" strokeWidth={2.5} />
              <BatteryFull className="w-6 h-6" strokeWidth={2} />
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar relative bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full flex flex-col"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Bottom Tab Bar */}
          <AnimatePresence>
            {isTabBarVisible && (
              <motion.nav 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50 rounded-b-none sm:rounded-b-[2.25rem]"
              >
                <div className="flex justify-around items-center h-[72px] px-6 pb-4 sm:pb-5">
                  <NavItem to="/" icon={<Home className="w-6 h-6" />} label="空间" />
                  <NavItem to="/bookshelf" icon={<Library className="w-6 h-6" />} label="书架" />
                  <NavItem to="/profile" icon={<User className="w-6 h-6" />} label="我的" />
                </div>
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-gray-900 rounded-full pointer-events-none" />
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Home Indicator (Fallback for pages without TabBar) */}
          <AnimatePresence>
            {!isTabBarVisible && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-gray-900 rounded-full z-50 pointer-events-none" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </AppProvider>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex flex-col items-center justify-center gap-1 w-16
        transition-colors duration-200
        ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            {icon}
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-900" 
              />
            )}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}