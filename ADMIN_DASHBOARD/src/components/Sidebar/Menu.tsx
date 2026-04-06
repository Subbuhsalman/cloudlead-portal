import { StyleClass } from 'primereact/styleclass';
import { Ripple } from 'primereact/ripple';
import Link from 'next/link';
import { useRef } from 'react';
import { useLayout } from "@/providers/LayoutProvider";
const Menu = ({ menuItems }: any) => {
 
  return (
    <div className="">
      <ul className="list-none p-0 m-0">
        {menuItems?.map((item: any, index: number) => (
          <MenuItem key={index} item={item}/>
        ))}
      </ul>
    </div>
  );
};

const MenuItem = ({ item }: any) => {
  const { isSideBarCollapsed } = useLayout();
  const ref = useRef(null);

  return (
    <li>
      {item.children && item.children.length > 0 ? (
        <>
          <StyleClass
            nodeRef={ref}
            selector="@next"
            enterFromClassName="hidden"
            enterActiveClassName="slidedown"
            leaveToClassName="hidden"
            leaveActiveClassName="slideup"
          >
            <Link
              style={{ textDecoration: 'none' }}
              ref={ref}
              href={'#'}
              className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-100 transition-duration-150 transition-colors w-full"
            >
              <i className={`pi ${item.icon} mr-2`}></i>
              {!isSideBarCollapsed && (
                    <>
                     <span className="font-regular">{item.label}</span>
              <i className="pi pi-chevron-down ml-auto mr-1"></i>
              <Ripple />
                    </>
              )}
             
            </Link>
          </StyleClass>
          <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
            {item.children.map((child: any, index: number) => (
              <MenuItem key={index} item={child} />
            ))}
          </ul>
        </>
      ) : (
        <Link
        prefetch={false}
          href={item.link || '#'}
          passHref
          style={{ textDecoration: 'none' }}
          className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-100 transition-duration-150 transition-colors w-full"
        >
          <i className={`pi ${item.icon} mr-2`}></i>
          {!isSideBarCollapsed && (
            <>
             <span className="font-regular">{item.label}</span>
             <Ripple />
            </>
             
          )}
          
          
        </Link>
      )}
    </li>
  );
};

export default Menu;
