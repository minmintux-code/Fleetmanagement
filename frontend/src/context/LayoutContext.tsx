import React, { createContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isSearchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  isNotificationPanelOpen: boolean;
  setNotificationPanelOpen: (open: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isSearchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState<boolean>(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        isSearchModalOpen,
        setSearchModalOpen,
        isNotificationPanelOpen,
        setNotificationPanelOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
