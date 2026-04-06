import { useEffect,useState } from "react";
import { useApplicationErrorHook } from ".";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";
import { useGlobalHook } from "@/hooks";
import { useTranslation } from 'react-i18next';
import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";

type Props = {
  applicationErrorId?: number | null,
  setApplicationErrorId?: (value: number | null) => void,
  setShowSidebar: (value: boolean) => void
}

const ApplicationErrorSidebar = (props: Props) => {
  const {
    saveForm,
    updateForm,
    ApplicationErrorLoading,
    ApplicationErrorSubmit,
    getSelectedApplicationErrorById,
    clearApplicationErrorDataHook,
    getApplicationErrorByIdFromStore,
  } = useApplicationErrorHook();
  const { updateGlobalToast } = useGlobalHook();
  const [isSaveAndExit, setIsSaveAndExit] = useState<boolean>(false);
  const { applicationErrorId = null, setApplicationErrorId = () =>{}, setShowSidebar = () =>{}} = props;
  const { t } = useTranslation();

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
      application_error_title: "",
    },
    validate: (data: any) => {
      const errors: any = {};

      if (!data.application_error_title) {
        errors.application_error_title = `${t('application_error_title is required.')}`;
      }
      return errors;
    },
    onSubmit: (data: any) => {
      const formPostData = {
        application_error_title: data.application_error_title,
      };

      if (applicationErrorId) {
        updateForm(applicationErrorId, formPostData, ()=>{},isSaveAndExit, setShowSidebar);
      } else {
        saveForm(formPostData, formik.resetForm,isSaveAndExit, setShowSidebar);
      }
    },
  });

  useEffect(() => {
    if (applicationErrorId && getApplicationErrorByIdFromStore === null) {
      getSelectedApplicationErrorById(applicationErrorId);
    } else {
      formik.setFieldValue(
        "application_error_title",
        getApplicationErrorByIdFromStore?.application_error_title
          ? getApplicationErrorByIdFromStore?.application_error_title
          : ""
      );
    }
  }, [getApplicationErrorByIdFromStore, applicationErrorId, formik, getSelectedApplicationErrorById]);

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

  return (
    <>
    
    <div className="card">
        <div className="text-3xl font-medium text-900 mb-3">
        {applicationErrorId ? `${t('Edit Application Error')}` : `${t('Add New Application Error')}`}
        </div>
      
        <hr />
      
      {ApplicationErrorLoading ? (
        <FormSkeleton />
      ) : (
        
        <form onSubmit={formik.handleSubmit}>
          <div className="grid p-fluid">
            <div className="col-12">
              <div className="scroll-height-300 mb-5">
                <div className="field">
                  <label className="block">
                    <span className="must-required">*</span>&nbsp;<span>{t('Application Error')}</span>
                  </label>
                  <InputText
                    placeholder={t('Enter Application Error')}
                    id="application_error_title"
                    name="application_error_title"
                    value={formik.values.application_error_title || ""}
                    onChange={formik.handleChange}
                    className={classNames({
                      invalid: isFormFieldValid("application_error_title"),
                    })}
                  />
                  {getFormErrorMessage("application_error_title")}
                </div>
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
                disabled={ApplicationErrorSubmit}
              />
              <Button
                type="submit"
                label={applicationErrorId ? `${t('Update Application Error')}` : `${t('Save & Next')}`}
                className="p-button p-button-primary p-button-outlined mr-3"
                disabled={ApplicationErrorSubmit}
                loading={ApplicationErrorSubmit}
                onClick={() => {
                  if (Object.keys(formik.errors).length !== 0) {
                    validationToast();
                   
                  } else {
                    setIsSaveAndExit(false)
                  }
                  formik.handleSubmit();
                }}
              />
              {!applicationErrorId &&               
              <Button
                type="submit"
                label={applicationErrorId ? `${t('Update Application Error')}` : `${t('Save & Exit')}`}
                className="p-button p-button-primary"
                disabled={ApplicationErrorSubmit}
                loading={ApplicationErrorSubmit}
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

export { ApplicationErrorSidebar };
