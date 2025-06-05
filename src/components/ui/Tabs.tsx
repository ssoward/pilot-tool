import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// Tabs Context
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs');
  }
  return context;
};

// Tabs Root Component
interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export const Tabs = ({ value, onValueChange, children, className = '' }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList Component
interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList = ({ children, className = '' }: TabsListProps) => {
  return (
    <div className={`flex p-1 bg-gray-100 rounded-lg ${className}`}>
      {children}
    </div>
  );
};

// TabsTrigger Component
interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsTrigger = ({ value, children, className = '' }: TabsTriggerProps) => {
  const { value: activeValue, onValueChange } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`
        flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
        ${isActive 
          ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// TabsContent Component
interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent = ({ value, children, className = '' }: TabsContentProps) => {
  const { value: activeValue } = useTabsContext();
  
  if (activeValue !== value) {
    return null;
  }

  return (
    <div className={`animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};
