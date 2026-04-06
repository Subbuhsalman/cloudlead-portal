
import React, { useEffect } from "react";
import { useAdminUserHook } from ".";
import { useTranslation } from 'react-i18next';

type Props = {
  adminUserId: number | null,
  setAdminUserId: (id:number | any) => void
}
const AdminUserModal = (props: Props) => {
  const {

    getSelectedAdminUserById,
    clearAdminUserDataHook,
    getAdminUserByIdFromStore,
  } = useAdminUserHook();

  const { adminUserId = null, setAdminUserId = () =>{} } = props;
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (adminUserId && getAdminUserByIdFromStore === null) {
      getSelectedAdminUserById(adminUserId);
    } 

    return () => {
      if (adminUserId) {
        clearAdminUserDataHook();
        setAdminUserId(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAdminUserByIdFromStore]);





  return (
    <>
      <p>Create your content here</p>
    </>
  );
};

export { AdminUserModal };
