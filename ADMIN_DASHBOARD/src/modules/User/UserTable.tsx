import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import { Button } from "primereact/button";
import { useUserHook } from "./UserHook";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Sidebar } from "primereact/sidebar";
import React, { useState } from "react";
import { UserSidebar } from "./UserSidebar";
import { useTranslation } from 'react-i18next';
import { Dialog } from "primereact/dialog";
import { DataTableSkeleton } from "@/components/Skeleton/DataTableSkeleton";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export const UserTable = (props: any) => {
  const { items, loading } = props;
  const [showCreditModal, setShowCreditModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [creditsToAdd, setCreditsToAdd] = useState<number>(0);
  const [creditNote, setCreditNote] = useState<string>("");
  const toast = useRef<Toast>(null);

  const { 
    addCreditsToUser
  } = useUserHook();
  const { t } = useTranslation();

  const handleAddCredits = async () => {
    if (creditsToAdd <= 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a valid credit amount',
        life: 3000
      });
      return;
    }

    try {
      await addCreditsToUser(selectedUser.user_id, creditsToAdd);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: `Added ${creditsToAdd} credits to ${selectedUser.name}`,
        life: 3000
      });
      setShowCreditModal(false);
      setCreditsToAdd(0);
      setCreditNote("");
      setSelectedUser(null);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add credits',
        life: 3000
      });
    }
  };

  const openCreditModal = (user: any) => {
    setSelectedUser(user);
    setShowCreditModal(true);
  };

  const actionBodyTemplate = (row: any) => {
    return (
      <div className="flex gap-2">
        <Button
          text
          type="button"
          className="p-button-success"
          onClick={() => openCreditModal(row)}
          icon="pi pi-plus"
          tooltip={t('Add Credits')}
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  const creditBodyTemplate = (row: any) => {
    // Calculate total remaining credits from UserCredit array
    const totalCredits = row.UserCredit?.reduce((sum: number, credit: any) => sum + (credit.remaining_credits || 0), 0) || 0;
    return (
      <span className="font-bold text-green-600">
        {totalCredits}
      </span>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Dialog
        header="Add Credits"
        visible={showCreditModal}
        style={{ width: "50vw" }}
        onHide={() => {
          setShowCreditModal(false);
          setCreditsToAdd(0);
          setCreditNote("");
          setSelectedUser(null);
        }}
        footer={() => (
          <div className="flex gap-2">
            <Button 
              label="Cancel" 
              className="p-button-secondary" 
              onClick={() => setShowCreditModal(false)} 
            />
            <Button 
              label="Add Credits" 
              className="p-button-success" 
              onClick={handleAddCredits} 
            />
          </div>
        )}
      >
        {selectedUser && (
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="userName">User Name</label>
              <InputText 
                id="userName" 
                value={selectedUser.name} 
                disabled 
                className="p-inputtext-sm"
              />
            </div>
            <div className="field">
              <label htmlFor="userEmail">Email</label>
              <InputText 
                id="userEmail" 
                value={selectedUser.email} 
                disabled 
                className="p-inputtext-sm"
              />
            </div>
            <div className="field">
              <label htmlFor="currentCredits">Current Credits</label>
              <InputText 
                id="currentCredits" 
                value={selectedUser.UserCredit?.reduce((sum: number, credit: any) => sum + (credit.remaining_credits || 0), 0) || 0} 
                disabled 
                className="p-inputtext-sm"
              />
            </div>
            <div className="field">
              <label htmlFor="creditsToAdd">Credits to Add *</label>
              <InputNumber
                id="creditsToAdd"
                value={creditsToAdd}
                onValueChange={(e) => setCreditsToAdd(e.value || 0)}
                min={1}
                max={10000}
                className="p-inputnumber-sm"
                placeholder="Enter credits to add"
              />
            </div>
            <div className="field">
              <label htmlFor="creditNote">Note (Optional)</label>
              <InputText
                id="creditNote"
                value={creditNote}
                onChange={(e) => setCreditNote(e.target.value)}
                className="p-inputtext-sm"
                placeholder="Add a note for this credit addition"
              />
            </div>
          </div>
        )}
      </Dialog>

      <div>
        <div>
          {!loading ? (
            <DataTable value={items} scrollable scrollHeight="calc(100vh - 250px)">
              <Column
                style={{ width: "10%" }}
                field="created_at"
                header={t('Created')}
                body={(row) => (
                  <>{moment(row?.created_at).format("Do MMM YYYY HH:mm")}</>
                )}
                sortable
              />

              <Column
                style={{ width: "15%" }}
                field="name"
                header={t('Name')}
                className="font-bold"
              />

              <Column
                style={{ width: "20%" }}
                field="email"
                header={t('Email')}
                className="font-bold"
              />

              <Column
                style={{ width: "10%" }}
                field="credits"
                header={t('Credits')}
                body={creditBodyTemplate}
                sortable
              />

              <Column
                style={{ width: "10%" }}
                field="status"
                header={t('Status')}
                body={(row) => (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    row.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {row.status || 'inactive'}
                  </span>
                )}
              />

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
                { field: "user_id", header: "ID" },
                { field: "created_at", header: t('Created') },
                { field: "name", header: t('Name') },
                { field: "email", header: t('Email') },
                { field: "credits", header: t('Credits') },
                { field: "status", header: t('Status') },
              ]}
            />
          )}
        </div>
      </div>
    </>
  );
};
