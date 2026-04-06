"use client";
import React, { useEffect, useRef, useState } from "react";
import SidebarMenu from "./Menu";
import { menuItems } from "@/utils/menuItem";
import MenuSearchbar from "./MenuSearchbar";
import { useLayout } from "@/providers/LayoutProvider";
type AdminMenuSidebar = {

};
const Sidebar: React.FC<AdminMenuSidebar> = (
  props: AdminMenuSidebar
) => {

  const { isSideBarCollapsed } = useLayout();
  const useRefState = (initialValue: any) => {
    const [state, setState] = useState(initialValue);
    const stateRef = useRef(state);
    useEffect(() => {
      stateRef.current = state;
    }, [state]);
    return [state, stateRef, setState];
  };
  const [, moduleList, setModuleList] = useRefState([...menuItems]);
  const handleSearchChange = (
    event: any,
    menuItems: any[],
    setModuleList: any
  ) => {
    const currSearchText = event.target.value;

    // Recursive function to search for a label in a module and its nested items
    const searchInModule = (module: any, searchText: string) => {
      const lowerSearchText = searchText.toLowerCase();
      const labelMatches = module.label.toLowerCase().includes(lowerSearchText);

      // Clone children to avoid mutating original data
      const childrenMatches =
        module.children &&
        module.children
          .map((child: any) => searchInModule(child, searchText))
          .filter((child: any) => child !== null);

      if (labelMatches || (childrenMatches && childrenMatches.length > 0)) {
        return {
          ...module,
          expanded: true,
          children: childrenMatches || [],
        };
      }
      return null;
    };

    if (currSearchText !== "") {
      const filteredModuleList = menuItems
        .map((module: any) => searchInModule(module, currSearchText))
        .filter((module: any) => module !== null);
      setModuleList(filteredModuleList);
    } else {
      setModuleList(menuItems); // Reset to original menuItems
    }
  };

  const isActive = (href: string) => {
    typeof window !== "undefined" && window.location.pathname === href
      ? "surface-100"
      : "";
  };




  return (
    <div
      id="app-sidebar-admin"
      className="transition-duration-300 surface-section hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none"
      style={{ width: isSideBarCollapsed ? 75 : 250 }}


    >
      <div className="flex flex-column h-screen">
        <div
          className="flex align-items-center px-5 flex-shrink-0"
          style={{ height: "60px" }}
        >
          {isSideBarCollapsed ? "ICON" : "Cloud Lead Admin"}
        </div>

        {!isSideBarCollapsed && (
          <MenuSearchbar
            menuItems={moduleList}
            setModuleList={setModuleList}
            handleSearchChange={handleSearchChange}
            className="transition-duration-300"
          />
        )}


        {/* Add overflow to the menu container */}
        <div className="flex-grow overflow-y-auto">
          <SidebarMenu
            menuItems={moduleList.current}

          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
