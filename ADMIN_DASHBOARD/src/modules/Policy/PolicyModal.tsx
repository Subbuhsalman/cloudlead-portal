// eslint-disable-next-line 
import React, { useEffect } from "react";
import { usePolicyHook } from ".";
import { useTranslation } from 'react-i18next';

type Props = {
  policyId: number | null,
  setPolicyId: (id:number|null) => void
}
const PolicyModal = (props: Props) => {
  const {

    getSelectedPolicyById,
    clearPolicyDataHook,
    getPolicyByIdFromStore,
  } = usePolicyHook();

  const { policyId = null, setPolicyId = () =>{} } = props;
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (policyId && getPolicyByIdFromStore === null) {
      getSelectedPolicyById(policyId);
    } 

    return () => {
      if (policyId) {
        clearPolicyDataHook();
        setPolicyId(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPolicyByIdFromStore]);





  return (
    <>
      <p>Create your content here</p>
    </>
  );
};

export { PolicyModal };
