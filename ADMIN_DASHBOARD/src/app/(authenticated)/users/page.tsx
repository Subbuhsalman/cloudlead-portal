"use client"
import { useUserHook, UserSidebar, UserToolBar, UserTable, UserPaginator } from '@/modules/User';
import { Sidebar } from 'primereact/sidebar';
import React, { useEffect, useState } from 'react'

const Page = () => {

    const [ showSidebar, setShowSidebar ] = useState<boolean>( false );
    const [ searchValue, setSearchValue ] = useState<string>("");

    const onClickNewBtn = () => setShowSidebar( true );
  
    const {
      UserLoading,
      UserHTTPRequest,
      UserSubmit,
      getPaginatedUserListFromStore,
      UserLayoutType,
      changeUserLayoutType,
      getPaginatedUserList,
      updateUserIsInitialTableDataLoaded,
    } = useUserHook();
    const items = getPaginatedUserListFromStore;
    
    useEffect( () => {
      /**
       * Check if store is empty, else get
       */
      if ( !items ) {
        getPaginatedUserList();
      }
  
      return () =>{
        updateUserIsInitialTableDataLoaded(false)
      }
    }, [] ); // eslint-disable-line react-hooks/exhaustive-deps
  
    const onChangeLayout = ( type: string = "table" ) => {
      changeUserLayoutType( type );
    };

    const handleSearch = (value: string) => {
      setSearchValue(value);
      // TODO: Implement search functionality
    };
  
    return (
      <>
        <Sidebar
          dismissable={ false }
          className="p-sidebar-lg"
          position="right"
          visible={ showSidebar }
          onHide={ () => setShowSidebar( false ) }
          showCloseIcon={ !UserSubmit }
        >
          <UserSidebar setShowSidebar={setShowSidebar} />
        </Sidebar>
  
        <UserToolBar
          heading={ "Users" }
          newBtn={ onClickNewBtn }
          showLayoutBtns={ false }
          showSearchFilter={ true }
          changeLayout={ onChangeLayout }
          layoutType={ UserLayoutType }
          onSearch={ handleSearch }
          searchValue={ searchValue }
          onSearchChange={ setSearchValue }
        />
        <div className="grid">
        <div className="col-12">
              <UserTable
                items={ items }
                loading={ UserLoading }
              />
            </div>
        </div>
        <UserPaginator />
      </>
    );
}

export default Page
