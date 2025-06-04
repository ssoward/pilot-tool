import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import AIAssistant from '../components/AIAssistant';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold">Pilot Tool</h1>
            <nav className="hidden md:flex space-x-4 lg:space-x-6">
              <Link to="/" className="hover:text-indigo-200 transition-colors text-sm lg:text-base">Dashboard</Link>
              <Link to="/initiatives" className="hover:text-indigo-200 transition-colors text-sm lg:text-base">Initiatives</Link>
              <Link to="/reports" className="hover:text-indigo-200 transition-colors text-sm lg:text-base">Reports</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 rounded-full hover:bg-indigo-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 hover:text-indigo-200 transition-colors">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-indigo-800 flex items-center justify-center">
                  <span className="font-medium text-sm">JD</span>
                </div>
                <span className="hidden lg:inline text-sm">John Doe</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-indigo-700">
          <nav className="container mx-auto px-4 py-2 flex justify-around">
            <Link to="/" className="hover:text-indigo-200 transition-colors text-sm py-2">Dashboard</Link>
            <Link to="/initiatives" className="hover:text-indigo-200 transition-colors text-sm py-2">Initiatives</Link>
            <Link to="/reports" className="hover:text-indigo-200 transition-colors text-sm py-2">Reports</Link>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p className="text-sm">&copy; {new Date().getFullYear()} FamilySearch Engineering. All rights reserved.</p>
        </div>
      </footer>

      {/* AI Assistant (floating) */}
      <AIAssistant />
    </div>
  );
};

export default MainLayout;
