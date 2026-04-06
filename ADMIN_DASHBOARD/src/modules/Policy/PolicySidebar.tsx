import { useEffect,useState } from "react";
import { usePolicyHook } from ".";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";
import { useGlobalHook } from "@/hooks";
import { useTranslation } from 'react-i18next';
import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";
import { defaultNodes, toSnakeCase, treeNodes } from "./PolicyUtils";
import { TreeSelect } from "primereact/treeselect";
import PolicySidebarLeft from "./PolicyComponents/PolicySidebarLeft";
import { Tree } from "primereact/tree";
import NodeTemplate from "./PolicyComponents/NodeTemplate";

type Props = {
  policyId?: number | null,
  setPolicyId?: (value: number | null) => void,
  setShowSidebar: (value: boolean) => void
}

const PolicySidebar = (props: Props) => {
  const {
    saveForm,
    updateForm,
    PolicyLoading,
    PolicySubmit,
    getSelectedPolicyById,
    clearPolicyDataHook,
    getPolicyByIdFromStore,
  } = usePolicyHook();
   
  const { updateGlobalToast } = useGlobalHook();
  const [isSaveAndExit, setIsSaveAndExit] = useState<boolean>(false);
  
  const [nodes, setNodes] = useState(treeNodes);
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const { policyId = null, setPolicyId = () =>{}, setShowSidebar = () =>{}} = props;
  const { t } = useTranslation();

function filterObjectsWithPolicies(data:any) {
  return data.filter((item:any) => {
    // Check if the current item has policies with length > 0
    const hasPolicies = item.policies && item.policies.length > 0;
    
    // If the item has children, recursively filter them
    if (item.children) {
      const filteredChildren = filterObjectsWithPolicies(item.children);
      
      // Keep the item if either it has policies or any of its children have policies
      return hasPolicies || filteredChildren.length > 0;
    }
    
    // If no children, just check if it has policies
    return hasPolicies;
  }).map((item:any) => {
    // Create a copy of the item to avoid modifying the original
    const newItem = {...item};
    
    // If the item has children, replace them with the filtered version
    if (item.children) {
      newItem.children = filterObjectsWithPolicies(item.children);
    }
    
    return newItem;
  });
}

// Usage:
// const filteredData = filterObjectsWithPolicies(yourDataArray);
  const validationToast = () => {
    updateGlobalToast({
      showToast: true,
      toastMessage: "Error! Please fill in all the fields with * before them.",
      toastDetail: null,
      toastType: "error",
    });
  };
  
  const formik: any = useFormik({
    initialValues: {
      policy_title: "",
    },
    validate: (data: any) => {
      const errors: any = {};

      if (!data.policy_title) {
        errors.policy_title = `${t('policy_title is required.')}`;
      }
      return errors;
    },
    onSubmit: (data: any) => {
      const formPostData = {
        policy_title: data.policy_title,
        policy_unique_identifier:toSnakeCase(data.policy_title),
        product_id:data.product.product_id,
        policy_meta_data:filterObjectsWithPolicies(nodes)
      };

      if (policyId) {
        updateForm(policyId, formPostData, ()=>{},isSaveAndExit, setShowSidebar);
      } else {
        saveForm(formPostData, formik.resetForm,isSaveAndExit, setShowSidebar);
      }
    },
  });

  useEffect(() => {
    if (policyId && getPolicyByIdFromStore === null) {
      getSelectedPolicyById(policyId);
    } else {
      formik.setFieldValue(
        "policy_title",
        getPolicyByIdFromStore?.policy_title
          ? getPolicyByIdFromStore?.policy_title
          : ""
      );
      console.log('SETTING',getPolicyByIdFromStore?.policy_meta_data );
      setNodes(getPolicyByIdFromStore?.policy_meta_data ? getPolicyByIdFromStore?.policy_meta_data:treeNodes) 
    }
  }, [getPolicyByIdFromStore, formik, getSelectedPolicyById, policyId]);

console.log('nodes',nodes);

  const isFormFieldValid = (name: any) => {
    return !!(formik.touched[name] && formik.errors[name]);
  };
  const getFormErrorMessage = (name: any) => {
    return (
      isFormFieldValid(name) && (
        <small className="block error">{formik.errors[name]}</small>
      )
    );
  };
  const nodeTemplate = (node: any, options: any) => {
    return (
      <div className="w-full">
      
        <NodeTemplate node={node} options={options} setNodes={setNodes}/>
    
        
        </div>

    )}

  return (
    <>
    
    <div className="card" style={{ height: "40vh" }}>
        <div className="text-3xl font-medium text-900 mb-3">
        {policyId ? `${t('Edit Policy')}` : `${t('Add New Policy')}`}
        </div>
      <p>
      Defines permissions and restrictions for user interaction with resources in a system
      </p>
        <hr />
      
      {PolicyLoading ? (
        <FormSkeleton />
      ) : (
        
        <form onSubmit={formik.handleSubmit}>
          <div className="grid p-fluid mt-4 h-full ">
            <div className="col-4 h-full">
            <PolicySidebarLeft
              formik={formik}
              selectedNodeKey={selectedNodeKey}
              setSelectedNodeKey={setSelectedNodeKey}
            />
            
            </div>
            <div className="col-8 h-full">
            <div className=" card  mb-5 p-4 border-1 border-round-xl surface-border">
              <div className="text-xl font-bold mb-2">Attach Modules To Access Policy</div>
              <Tree value={nodes} filter filterMode="lenient" filterPlaceholder="Lenient Filter" className="w-full scroll-height-375" nodeTemplate={nodeTemplate}/>
          </div>
                  
          </div>

          </div>
          <div className="w-full px-4 py-3 surface-100 text-right sidebar-footer">
            <div className="text-right">
              <Button
              text
                onClick={() => setShowSidebar(false)}
                icon="pi pi-times"
                type="button"
                label={t('Cancel')}
                className=" p-button-danger p-component mr-3"
                disabled={PolicySubmit}
              />
              <Button
                type="submit"
                label={policyId ? `${t('Update Policy')}` : `${t('Save & Next')}`}
                className="p-button p-button-primary p-button-outlined mr-3"
                disabled={PolicySubmit}
                loading={PolicySubmit}
                onClick={() => {
                  if (Object.keys(formik.errors).length !== 0) {
                    validationToast();
                   
                  } else {
                    setIsSaveAndExit(false)
                  }
                  formik.handleSubmit();
                }}
              />
              {!policyId &&               
              <Button
                type="submit"
                label={policyId ? `${t('Update Policy')}` : `${t('Save & Exit')}`}
                className="p-button p-button-primary"
                disabled={PolicySubmit}
                loading={PolicySubmit}
                onClick={() => {
                  if (Object.keys(formik.errors).length !== 0) {
                    validationToast();
                    
                  } else {
                    setIsSaveAndExit(true)
                  }
                  formik.handleSubmit();
                }}
              />
              }
            </div>
          </div>
        </form>
      )}
    </div>
    </>
  );
};

export { PolicySidebar };
