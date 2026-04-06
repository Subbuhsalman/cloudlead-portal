
'use client'
import React, { useEffect, useRef } from 'react'
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";

import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useLoginDetails } from '@/hooks';
import { useLayout } from '@/providers/LayoutProvider';
import Sidebar from '../Sidebar/Sidebar';

export const DashboardLayout = ({ children }: any) => {
    const { checkValidLoginRoute, removeUserInfo} = useLoginDetails();
    const { isSideBarCollapsed,setIsSideBarCollapsed,lockSideBar,setLockSideBar} = useLayout();

    const btnRef22 = useRef(null);
 
    const op = useRef<any>(null);
    const handleLock = () => {
 
        setLockSideBar(!lockSideBar);
          setIsSideBarCollapsed(!isSideBarCollapsed);
      };
    useEffect(() => {
       checkValidLoginRoute()
          return () => {};
    }, [checkValidLoginRoute])
    return (
        <div className="min-h-screen flex relative lg:static surface-ground">
            <Sidebar />
           
            <div className="min-h-screen flex flex-column relative flex-auto">

    
                <div
                    className="flex justify-content-between align-items-center px-5 surface-section relative lg:static border-bottom-1 surface-border"
                    style={{ height: "60px" }}
                >
                    <div className="flex">
                    <a
            ref={btnRef22}
            onClick={() => {
                handleLock();
            }}
            className="p-ripple cursor-pointer block text-700"
          >
            <i
              className={`pi ${
                !lockSideBar ? "pi-lock" : "pi-lock-open"
              } text-2xl`}
            ></i>
          </a>
          <StyleClass
            nodeRef={btnRef22}
            enterFromClassName="hidden"
            enterActiveClassName="fadeinleft"
            leaveToClassName="hidden"
            leaveActiveClassName="fadeoutleft"
            hideOnOutsideClick
          ></StyleClass>
                        
                    </div>
                  
                    <ul
                        className="list-none p-0 m-0 hidden lg:flex lg:align-items-center select-none lg:flex-row
    surface-section border-1 lg:border-none surface-border right-0 top-100 z-1 shadow-2 lg:shadow-none absolute lg:static"
                    >
         
                        <li className="border-top-1 surface-border lg:border-top-none">
                            <a
                                className="p-ripple flex p-3 lg:px-3 lg:py-2 align-items-center hover:surface-100 font-medium border-round cursor-pointer
            transition-duration-150 transition-colors"
                            >
                                <Button type="button" size='small' icon="pi pi-user" rounded text aria-label="Filter" style={{ padding: 0 }} className='p-0 px-0' outlined onClick={(e) => op.current.toggle(e)} />

                                <OverlayPanel ref={op}>
                                    <div className="block">
                                    <Button type="button" label='Logout' size='small' icon="pi pi-user" rounded text aria-label="Filter" style={{ padding: 0 }} className='p-0 px-0' outlined onClick={(e) => removeUserInfo()} />

                                    </div>
                                </OverlayPanel>
                                <Ripple />
                            </a>
                        </li>

                    </ul>
                </div>
                <div className="p-5 flex flex-column flex-auto">
                    <div className="border-2 border-dashed surface-border border-round surface-section flex-auto overflow-hidden md:overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
