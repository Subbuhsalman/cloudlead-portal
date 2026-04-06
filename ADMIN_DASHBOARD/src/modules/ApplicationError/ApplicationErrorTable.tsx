import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import { Button } from "primereact/button";
import { useApplicationErrorHook } from "./ApplicationErrorHook";
import { confirmDialog } from "primereact/confirmdialog";
import { Sidebar } from "primereact/sidebar";
import React,{ useState } from "react";
import { ApplicationErrorSidebar } from "./ApplicationErrorSidebar";
// import { DataTableSkeleton } from "@/components/Skeleton/DataTableSkeleton";
import { useTranslation } from 'react-i18next';
import { ApplicationErrorModal } from "./ApplicationErrorModal";
import { Dialog } from "primereact/dialog";
import { DataTableSkeleton } from "@/components/Skeleton/DataTableSkeleton";


export const ApplicationErrorTable = ( props: any ) => {
  const { items, loading,  } = props;

  const { deleteForm, clearApplicationErrorDataHook, ApplicationErrorLoading, ApplicationErrorSubmit,} = useApplicationErrorHook();
  const [ showModal, setShowModal ] = useState<boolean>( false );
  const [ showApplicationErrorItemViewSidebar, setShowApplicationErrorItemViewSidebar ] = useState<boolean>(
    false
  );

  const [ applicationErrorId, setApplicationErrorId ] = useState<any>();
  const { t, i18n } = useTranslation();

  const deleteRowHandler = ( row: any ) => {
    confirmDialog( {
      message: t('Do you want to delete this record?'),
      header: t('Delete Confirmation'),
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteForm( row );
      },
      reject: () => { },
    } );
  };

  const actionBodyTemplate = ( row: any ) => {
    return (
      <>
        <Button
        text
          type="button"
          className="p-button-info "
          onClick={ () => {
            setApplicationErrorId( row?.application_error_id );
            setShowApplicationErrorItemViewSidebar( true );
          } }
          icon="pi pi-pencil"
        ></Button>

      <Button
       text
          type="button"
          className="p-button-info "
          onClick={ () => {
            setApplicationErrorId( row?.application_error_id );
            setShowModal( true );
          } }
          icon="pi pi-eye"
        ></Button>

        <Button
         text
          type="button"
          className="p-button-danger left-space"
          onClick={ () => deleteRowHandler( row ) }
          icon="pi pi-trash"
        ></Button>
      </>
    );
  };

  return (
    <>
      <Dialog
      maximizable
      onHide={()=>{setShowModal(false)}}
      header="ApplicationError"
      visible={showModal}
      style={{ width: "50vw" }}
      footer={() => (
        <>
        <Button label="Close" className="p-button-danger" onClick={() => setShowModal(false)} />
          
        </>
      )}
      >
          <ApplicationErrorModal applicationErrorId={null} setApplicationErrorId={()=>{}} />
      </Dialog>

      <Sidebar
            dismissable={ false }
            className="p-sidebar-lg"
            position="right"
            visible={ showApplicationErrorItemViewSidebar }
            onHide={ () => setShowApplicationErrorItemViewSidebar( false ) }
            showCloseIcon={ !ApplicationErrorSubmit }
          >
            <ApplicationErrorSidebar
              applicationErrorId={ applicationErrorId }
              setApplicationErrorId={ setApplicationErrorId }
              setShowSidebar={ setShowApplicationErrorItemViewSidebar }
            />
          </Sidebar>
      <div>
        <div>


         

          { !loading ? (
            <DataTable value={ items } scrollable scrollHeight="calc(100vh - 250px)"
            >
              <Column
                style={ { width: "10%" } }
                field="application_error_id"
                header={t('ID')}
                sortable
              ></Column>

              <Column
                style={ { width: "10%" } }
                field="created_at"
                header={t('Created')}
                body={ ( row ) => (
                  <>{ moment( row?.created_at ).format( "Do MMM YYYY HH:mm" ) }</>
                ) }
                sortable
              ></Column>

              <Column
                style={ { width: "10%" } }
                field="application_error_title"
                header={t('Application Error Title')}
                className="font-bold"
            
              ></Column>



              <Column
                style={ { width: "10%" } }
                headerStyle={ { textAlign: "center" } }
                bodyStyle={ { textAlign: "left", overflow: "visible" } }
                body={ ( e ) => actionBodyTemplate( e ) }
              />
            </DataTable>
          ) : (
            <DataTableSkeleton
              noOfRows={ 15 }
              columns={ [
                { field: "application_error_id", header: "ID" },
                { field: "created_at", header: t('Created') },
              ] }
            />
          ) }
        </div>
      </div>
    </>
  );
};
