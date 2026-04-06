import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import { Button } from "primereact/button";
import { useAdminUserHook } from "./AdminUserHook";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Sidebar } from "primereact/sidebar";
import React, { useState } from "react";
import { AdminUserSidebar } from "./AdminUserSidebar";
import { useTranslation } from 'react-i18next';
import { AdminUserModal } from "./AdminUserModal";
// import { PasswordUpdateModal } from "./PasswordUpdateModal";
import { Dialog } from "primereact/dialog";
import { DataTableSkeleton } from "@/components/Skeleton/DataTableSkeleton";


export const AdminUserTable = (props: any) => {
  const { items, loading, } = props;

  const { 
    deleteForm, 
    AdminUserSubmit,
    getSelectedAdminUserById,
    updateForm
  } = useAdminUserHook();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAdminUserItemViewSidebar, setShowAdminUserItemViewSidebar] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [adminUserId, setAdminUserId] = useState<any>();
  const { t } = useTranslation();

  const deleteRowHandler = (row: any) => {
    confirmDialog({
      message: t('Do you want to delete this record?'),
      header: t('Delete confirmation'),
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteForm(row);
      },
      reject: () => { },
    });
  };


  const actionBodyTemplate = (row: any) => {
    return (
      <div className="flex gap-2">
        <Button
          text
          type="button"
          className="p-button-info"
          onClick={() => {
            setAdminUserId(row?.admin_user_id);
            getSelectedAdminUserById(row?.admin_user_id);
            setShowAdminUserItemViewSidebar(true);
          }}
          icon="pi pi-pencil"
          tooltip={t('Edit')}
          tooltipOptions={{ position: 'top' }}
        />

        {/* <Button
          text
          type="button"
          className="p-button-info"
          onClick={() => {
            setAdminUserId(row?.admin_user_id);
            getSelectedAdminUserById(row?.admin_user_id);
            setShowModal(true);
          }}
          icon="pi pi-eye"
          tooltip={t('View')}
          tooltipOptions={{ position: 'top' }}
        /> */}
{/* 
        <Button
          text
          type="button"
          className="p-button-warning"
          onClick={() => {
            setAdminUserId(row?.admin_user_id);
            setShowPasswordModal(true);
          }}
          icon="pi pi-key"
          tooltip={t('Update Password')}
          tooltipOptions={{ position: 'top' }}
        /> */}

        <Button
          text
          type="button"
          className="p-button-danger"
          onClick={() => deleteRowHandler(row)}
          icon="pi pi-trash"
          tooltip={t('Delete')}
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  return (
    <>
    <ConfirmDialog />
      <Dialog
        maximizable
        onHide={() => { setShowModal(false) }}
        header="AdminUser"
        visible={showModal}
        style={{ width: "50vw" }}
        footer={() => (
          <>
            <Button label="Close" className="p-button-danger" onClick={() => setShowModal(false)} />

          </>
        )}
      >
        <AdminUserModal adminUserId={adminUserId} setAdminUserId={setAdminUserId} />
      </Dialog>

      <Sidebar
        dismissable={false}
        className="p-sidebar-lg"
        position="right"
        visible={showAdminUserItemViewSidebar}
        onHide={() => setShowAdminUserItemViewSidebar(false)}
        showCloseIcon={!AdminUserSubmit}
      >
        <AdminUserSidebar
          adminUserId={adminUserId}
          setAdminUserId={setAdminUserId}
          setShowSidebar={setShowAdminUserItemViewSidebar}
        />
      </Sidebar>

      {/* <PasswordUpdateModal
        visible={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        adminUserId={adminUserId}
        onPasswordUpdate={handlePasswordUpdate}
      /> */}

      <div>
        <div>




          {!loading ? (
            <DataTable value={items} scrollable scrollHeight="calc(100vh - 250px)"
            >
              <Column
                style={{ width: "10%" }}
                field="created_at"
                header={t('Created')}
                body={(row) => (
                  <>{moment(row?.created_at).format("Do MMM YYYY HH:mm")}</>
                )}
                sortable
              ></Column>

              <Column
                style={{ width: "10%" }}
                field="name"
                header={t('Name')}
                className="font-bold"

              ></Column>

              <Column
                style={{ width: "10%" }}
                field="email"
                header={t('Email')}
                className="font-bold"

              ></Column>

              <Column
                style={{ width: "10%" }}
                headerStyle={{ textAlign: "center" }}
                bodyStyle={{ textAlign: "left", overflow: "visible" }}
                body={(e) => actionBodyTemplate(e)}
              />
            </DataTable>
          ) : (
            <DataTableSkeleton
              noOfRows={15}
              columns={[
                { field: "admin_user_id", header: "ID" },
                { field: "created_at", header: t('Created') },
              ]}
            />
          )}
        </div>
      </div>
    </>
  );
};
