import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import { Button } from "primereact/button";
import { useGalleryHook } from "./GalleryHook";
import { confirmDialog } from "primereact/confirmdialog";
import { Sidebar } from "primereact/sidebar";
import React,{ useState } from "react";
import { GallerySidebar } from "./GallerySidebar";
import { DataTableSkeleton } from "@/components/Skeleton/DataTableSkeleton";
import { useTranslation } from 'react-i18next';
import { GalleryModal } from "./GalleryModal";
import { Dialog } from "primereact/dialog";


export const GalleryTable = ( props: any ) => {
  const { items, loading,  } = props;

  const { deleteForm, clearGalleryDataHook, GalleryLoading, GallerySubmit,} = useGalleryHook();
  const [ showModal, setShowModal ] = useState<boolean>( false );
  const [ showGalleryItemViewSidebar, setShowGalleryItemViewSidebar ] = useState<boolean>(
    false
  );

  const [ galleryId, setGalleryId ] = useState<any>();
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
            setGalleryId( row?.gallery_id );
            setShowGalleryItemViewSidebar( true );
            clearGalleryDataHook()

          } }
          icon="pi pi-pencil"
        ></Button>

      {/* <Button
       text
          type="button"
          className="p-button-info "
          onClick={ () => {
            setGalleryId( row?.gallery_id );
            setShowModal( true );
          } }
          icon="pi pi-eye"
        ></Button> */}

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
      header="Gallery"
      visible={showModal}
      style={{ width: "50vw" }}
      footer={() => (
        <>
        <Button label="Close" className="p-button-danger" onClick={() => setShowModal(false)} />
          
        </>
      )}
      >
          <GalleryModal galleryId={null} setGalleryId={()=>{}} />
      </Dialog>

      <Sidebar
            dismissable={ false }
            className="p-sidebar-lg"
            position="right"
            visible={ showGalleryItemViewSidebar }
            onHide={ () => setShowGalleryItemViewSidebar( false ) }
            showCloseIcon={ !GallerySubmit }
          >
            <GallerySidebar
              galleryId={ galleryId }
              setGalleryId={ setGalleryId }
              setShowSidebar={ setShowGalleryItemViewSidebar }
            />
          </Sidebar>
      <div>
        <div>


         

          { !loading ? (
            <DataTable value={ items } scrollable scrollHeight="calc(100vh - 350px)"
            >
              <Column
                style={ { width: "10%" } }
                field="gallery_id"
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
                field="gallery_title"
                header={t('Gallery Title')}
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

            />
          ) }
        </div>
      </div>
    </>
  );
};
