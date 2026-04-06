"use client";
import React, { FC, useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";

import {
  ApplicationErrorToolBar,
  ApplicationErrorTable,
  ApplicationErrorPaginator,
  ApplicationErrorSidebar,
  useApplicationErrorHook
} from "@/modules/ApplicationError";

  
const ApplicationErrorModule: FC = () => {

  const [ showSidebar, setShowSidebar ] = useState<boolean>( false );

  
  const onClickNewBtn = () => setShowSidebar( true );

  const {
    ApplicationErrorLoading,
    ApplicationErrorHTTPRequest,
    ApplicationErrorSubmit,
    getPaginatedApplicationErrorListFromStore,
    ApplicationErrorLayoutType,
    changeApplicationErrorLayoutType,
    getPaginatedApplicationErrorList,
    updateApplicationErrorIsInitialTableDataLoaded,
    clearApplicationErrorDataHook
  } = useApplicationErrorHook();
  const items = getPaginatedApplicationErrorListFromStore;
  useEffect( () => {
    /**
     * Check if store is empty, else get
     */
    if ( !items ) {
      getPaginatedApplicationErrorList();
    }

    return () =>{
      updateApplicationErrorIsInitialTableDataLoaded(false)
    }
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps


  const onChangeLayout = ( type: string = "table" ) => {
    changeApplicationErrorLayoutType( type );
  };

  return (
    <>
    
      <Sidebar
        dismissable={ false }
        className="p-sidebar-lg"
        position="right"
        visible={ showSidebar }
        onHide={ () => setShowSidebar( false ) }
        showCloseIcon={ !ApplicationErrorSubmit }
      >
        <ApplicationErrorSidebar setShowSidebar={ setShowSidebar } />
      </Sidebar>

      <ApplicationErrorToolBar
        heading={ "Application Error" }
        newBtn={ onClickNewBtn }
        showLayoutBtns={ false }
        showSearchFilter={ true }
        changeLayout={ onChangeLayout }
        layoutType={ ApplicationErrorLayoutType }
      />
      <div className="grid">
      <div className="col-12">
            <ApplicationErrorTable
              items={ items }
              loading={ ApplicationErrorLoading }
            />
          </div>
      </div>
      <ApplicationErrorPaginator />
    </>
  );
};


export default ApplicationErrorModule ;
