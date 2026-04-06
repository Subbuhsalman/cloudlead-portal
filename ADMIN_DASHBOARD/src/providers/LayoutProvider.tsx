"use client";
import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
} from "react";

interface LayoutContextType {
  isSideBarCollapsed: boolean;
  lockSideBar: boolean;
  setIsSideBarCollapsed: (state: boolean) => void;
  setLockSideBar: (state: boolean) => void;
}
const defaultValue: LayoutContextType = {
  isSideBarCollapsed: true,
  lockSideBar: true,
  setIsSideBarCollapsed: () => {},
  setLockSideBar: () => {}
}
const LayoutContext = createContext<LayoutContextType | null>(defaultValue);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState<boolean>(false);
  const [lockSideBar, setLockSideBar] = useState<boolean>(true);

  return (
    <LayoutContext.Provider
      value={{
        isSideBarCollapsed,
        lockSideBar,
        setIsSideBarCollapsed,
        setLockSideBar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within LayoutProvider");
  }
  return context;
};