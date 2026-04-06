import { useEffect, useState } from "react";
import { useAdminUserHook } from ".";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useTranslation } from 'react-i18next';
import { useGlobalHook } from "@/hooks";
import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";
import { generatePassword } from "@/utils";
import { Password } from 'primereact/password';

type Props = {
  adminUserId: number | null;
  setAdminUserId: (value: number | null) => void;
  setShowSidebar: (value: boolean) => void;
};

const AdminUserSidebar = (props: Props) => {
  const {
    saveForm,
    updateForm,
    AdminUserLoading,
    AdminUserSubmit,
    getSelectedAdminUserById,
    clearAdminUserDataHook,
    getAdminUserByIdFromStore,
  } = useAdminUserHook();
  
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const { updateGlobalToast } = useGlobalHook();
  const [isSaveAndExit, setIsSaveAndExit] = useState<boolean>(false);
  
  const { adminUserId = null, setAdminUserId = () => {}, setShowSidebar = () => {} } = props;
  
  // Reset form when switching between create/edit modes
  useEffect(() => {
    if (!adminUserId) {
      formik.resetForm();
    }
  }, [adminUserId]);
  const { t } = useTranslation();

  useEffect(() => {
    if (adminUserId && getAdminUserByIdFromStore === null) {
      setIsLoadingUserData(true);
      getSelectedAdminUserById(adminUserId);
    } else if (getAdminUserByIdFromStore && adminUserId) {
      // Populate form with user data for editing
      setIsLoadingUserData(false);
      formik.setFieldValue("name", getAdminUserByIdFromStore?.name || "");
      formik.setFieldValue("email", getAdminUserByIdFromStore?.email || "");
      formik.setFieldValue("password", ""); // Clear password field for security
    } else if (!adminUserId) {
      // Reset form for new user creation
      setIsLoadingUserData(false);
      formik.resetForm();
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAdminUserByIdFromStore, adminUserId]);


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
      name: "",
      email: "",
      password: "",
    },
    validate: (data: any) => {
      const errors: any = {};

      if (!data.name || data.name.trim() === '') {
        errors.name = `${t('Login Name is required.')}`;
      }
      
      if (!data.email || data.email.trim() === '') {
        errors.email = `${t('Email is required.')}`;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = `${t('Please enter a valid email address.')}`;
      }
      
      // For new users, password is required. For existing users, password is optional
      if (!adminUserId && (!data.password || data.password.trim() === '')) {
        errors.password = `${t('Password is required.')}`;
      } else if (data.password && data.password.length < 6) {
        errors.password = `${t('Password must be at least 6 characters long.')}`;
      }
      
      return errors;
    },
    onSubmit: (data: any) => {
      const formPostData = { ...data };
      
      // For updates, only include password if it's provided
      if (adminUserId && (!formPostData.password || formPostData.password.trim() === '')) {
        delete formPostData.password;
      }

      if (adminUserId) {
        updateForm(adminUserId, formPostData, formik.resetForm, isSaveAndExit, setShowSidebar);
      } else {
        saveForm(formPostData, formik.resetForm, isSaveAndExit, setShowSidebar);
      }
    },
  });
  console.log(formik.errors, "errors");

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
    <div className="card pb-8">
      <div className="text-3xl font-medium text-900 mb-3">
        {adminUserId ? `${t('Edit Admin User')}` : `${t('Add New Admin User')}`}
      </div>
   
      {AdminUserLoading || isLoadingUserData ? (
        <FormSkeleton />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="grid p-fluid pt-5">

            <div className="col-12 field">
              <label>
                <span className="must-required">*</span>&nbsp;{t('Login Name')}
              </label>
              <InputText
                id="name"
                name="name"
                value={formik.values.name || ""}
                onChange={formik.handleChange}
                className={classNames({ invalid: isFormFieldValid("name") })}
              />
              {getFormErrorMessage("name")}
            </div>





            <div className="col-12 field">
              <label>
                <span className="must-required">*</span>&nbsp;{t('Email')}
              </label>
              <InputText
                id="email"
                name="email"
                value={formik.values.email || ""}
                onChange={formik.handleChange}
                className={classNames({ invalid: isFormFieldValid("email") })}
              />
              {getFormErrorMessage("email")}
            </div>


            <div className="col-12 field">
              <label>
                {!adminUserId && <span className="must-required">*</span>}&nbsp;{t('Password')}
                {adminUserId && <span className="text-sm text-600 ml-2">({t('Leave blank to keep current password')})</span>}
              </label>
              <div className="">
                <Password
                toggleMask
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password || ""}
                  onChange={formik.handleChange}
                  className={`w-full w-12 `}
                  placeholder={adminUserId ? t('Enter new password (optional)') : t('Enter password')}
                />
               
              </div>
              {getFormErrorMessage("password")}
            </div>
          </div>

          <div className="w-full px-4 py-3 surface-100 text-right sidebar-footer">
            <Button
              text
              onClick={() => setShowSidebar(false)}
              icon="pi pi-times"
              type="button"
              label={t('Cancel')}
              className="p-button-danger p-component mr-3"
              disabled={AdminUserSubmit}
            />
            <Button
              type="submit"
              label={adminUserId ? `${t('Update Admin User')}` : `${t('Save & Next')}`}
              className="p-button p-button-primary p-button-outlined mr-3"
              disabled={AdminUserSubmit}
              loading={AdminUserSubmit}
              onClick={() => {
                if (Object.keys(formik.errors).length !== 0) {
                  validationToast();
                } else {
                  setIsSaveAndExit(false);
                }
                formik.handleSubmit();
              }}
            />
            {!adminUserId && (
              <Button
                type="submit"
                label={t('Save & Exit')}
                className="p-button p-button-primary"
                disabled={AdminUserSubmit}
                loading={AdminUserSubmit}
                onClick={() => {
                  if (Object.keys(formik.errors).length !== 0) {
                    validationToast();
                  } else {
                    setIsSaveAndExit(true);
                  }
                  formik.handleSubmit();
                }}
              />
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export  {AdminUserSidebar};
