"use client"
import { useAdminUserHook, AdminUserSidebar, AdminUserToolBar, AdminUserTable, AdminUserPaginator } from '@/modules/AdminUser';
import { Sidebar } from 'primereact/sidebar';
import React, { useEffect, useState } from 'react'

const Page = () => {

    const [ showSidebar, setShowSidebar ] = useState<boolean>( false );

  
    const onClickNewBtn = () => setShowSidebar( true );
  
    const {
      AdminUserLoading,
      AdminUserHTTPRequest,
      AdminUserSubmit,
      getPaginatedAdminUserListFromStore,
      AdminUserLayoutType,
      changeAdminUserLayoutType,
      getPaginatedAdminUserList,
      updateAdminUserIsInitialTableDataLoaded,
      clearAdminUserDataHook
    } = useAdminUserHook();
    const items = getPaginatedAdminUserListFromStore;
    useEffect( () => {
      /**
       * Check if store is empty, else get
       */
      if ( !items ) {
        getPaginatedAdminUserList();
      }
  
      return () =>{
        updateAdminUserIsInitialTableDataLoaded(false)
      }
    }, [] ); // eslint-disable-line react-hooks/exhaustive-deps
  
  
    const onChangeLayout = ( type: string = "table" ) => {
      changeAdminUserLayoutType( type );
    };
  
    return (
      <>
      
        <Sidebar
          dismissable={ false }
          className="p-sidebar-lg"
          position="right"
          visible={ showSidebar }
          onHide={ () => setShowSidebar( false ) }
          showCloseIcon={ !AdminUserSubmit }
        >
          <AdminUserSidebar setShowSidebar={setShowSidebar} adminUserId={null} setAdminUserId={()=>{}} />
        </Sidebar>
  
        <AdminUserToolBar
          heading={ "Admin User" }
          newBtn={ onClickNewBtn }
          showLayoutBtns={ false }
          showSearchFilter={ true }
          changeLayout={ onChangeLayout }
          layoutType={ AdminUserLayoutType }
        />
        <div className="grid">
        <div className="col-12">
              <AdminUserTable
                items={ items }
                loading={ AdminUserLoading }
              />
            </div>
        </div>
        <AdminUserPaginator />
      </>
    );
}

export default Page