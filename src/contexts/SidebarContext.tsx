import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface SidebarContextType {
  leftOpen: boolean;
  rightOpen: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  closeAll: () => void;
  anyOpen: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  leftOpen: false,
  rightOpen: false,
  toggleLeft: () => {},
  toggleRight: () => {},
  closeAll: () => {},
  anyOpen: false,
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const toggleLeft = useCallback(() => {
    setLeftOpen((prev) => {
      if (!prev) setRightOpen(false);
      return !prev;
    });
  }, []);

  const toggleRight = useCallback(() => {
    setRightOpen((prev) => {
      if (!prev) setLeftOpen(false);
      return !prev;
    });
  }, []);

  const closeAll = useCallback(() => {
    setLeftOpen(false);
    setRightOpen(false);
  }, []);

  // Close sidebars on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeAll]);

  const anyOpen = leftOpen || rightOpen;

  return (
    <SidebarContext.Provider value={{ leftOpen, rightOpen, toggleLeft, toggleRight, closeAll, anyOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
