// eslint-disable-next-line 
import React, { useEffect } from "react";
import { useApplicationErrorHook } from ".";
import { useTranslation } from 'react-i18next';

type Props = {
  applicationErrorId: number | null,
  setApplicationErrorId: (id:number|null) => void
}
const ApplicationErrorModal = (props: Props) => {
  const {

    getSelectedApplicationErrorById,
    clearApplicationErrorDataHook,
    getApplicationErrorByIdFromStore,
  } = useApplicationErrorHook();

  const { applicationErrorId = null, setApplicationErrorId = () =>{} } = props;
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (applicationErrorId && getApplicationErrorByIdFromStore === null) {
      getSelectedApplicationErrorById(applicationErrorId);
    } 

    return () => {
      if (applicationErrorId) {
        clearApplicationErrorDataHook();
        setApplicationErrorId(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApplicationErrorByIdFromStore]);





  return (
    <>
      <p>Create your content here</p>
    </>
  );
};

export { ApplicationErrorModal };
