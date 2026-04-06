import { useEffect,useState } from "react";
import { useGalleryHook } from ".";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";
import { useGlobalHook } from "@/hooks";
import { useTranslation } from 'react-i18next';

type Props = {
  galleryId?: number | null,
  setGalleryId?: (value: number | null) => void,
  setShowSidebar: (value: boolean) => void
}

const GallerySidebar = (props: Props) => {
  const {
    saveForm,
    updateForm,
    GalleryLoading,
    GallerySubmit,
    getSelectedGalleryById,
    clearGalleryDataHook,
    getGalleryByIdFromStore,
  } = useGalleryHook();
  const { updateGlobalToast } = useGlobalHook();
  const [isSaveAndExit, setIsSaveAndExit] = useState<boolean>(false);
  const { galleryId = null, setGalleryId = () =>{}, setShowSidebar = () =>{}} = props;
  const { t } = useTranslation();
  useEffect(() => {
    if (galleryId && getGalleryByIdFromStore === null) {
      getSelectedGalleryById(galleryId);
    } else {
      formik.setFieldValue(
        "gallery_title",
        getGalleryByIdFromStore?.gallery_title
          ? getGalleryByIdFromStore?.gallery_title
          : ""
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGalleryByIdFromStore]);

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
      gallery_title: "",
    },
    validate: (data: any) => {
      const errors: any = {};

      if (!data.gallery_title) {
        errors.gallery_title = `${t('gallery_title is required.')}`;
      }
      return errors;
    },
    onSubmit: (data: any) => {
      const formPostData = {
        gallery_title: data.gallery_title,
      };

      if (galleryId) {
        updateForm(galleryId, formPostData, formik.resetForm,isSaveAndExit, setShowSidebar);
      } else {
        saveForm(formPostData, formik.resetForm,isSaveAndExit, setShowSidebar);
      }
    },
  });

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
        {galleryId ? `${t('Edit Gallery')}` : `${t('Add New Gallery')}`}
        </div>
        <div className="font-medium text-500 mb-3">
          Gallery text here
        </div>
        <hr />
      
      {GalleryLoading ? (
        <FormSkeleton />
      ) : (
        
        <form onSubmit={formik.handleSubmit}>
          <div className="grid p-fluid">
            <div className="col-12">
              <div className="scroll-height-300 mb-5">
                <div className="field">
                  <label className="block">
                    <span className="must-required">*</span>&nbsp;<span>{t('Gallery')}</span>
                  </label>
                  <InputText
                    placeholder={t('Enter Gallery')}
                    id="gallery_title"
                    name="gallery_title"
                    value={formik.values.gallery_title || ""}
                    onChange={formik.handleChange}
                    className={classNames({
                      invalid: isFormFieldValid("gallery_title"),
                    })}
                  />
                  {getFormErrorMessage("gallery_title")}
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
                disabled={GallerySubmit}
              />
              <Button
                type="submit"
                label={galleryId ? `${t('Update Gallery')}` : `${t('Save & Next')}`}
                className="p-button p-button-primary p-button-outlined mr-3"
                disabled={GallerySubmit}
                loading={GallerySubmit}
                onClick={() => {
                  if (Object.keys(formik.errors).length !== 0) {
                    validationToast();
                   
                  } else {
                    setIsSaveAndExit(false)
                  }
                  formik.handleSubmit();
                }}
              />
              {!galleryId &&               
              <Button
                type="submit"
                label={galleryId ? `${t('Update Gallery')}` : `${t('Save & Exit')}`}
                className="p-button p-button-primary"
                disabled={GallerySubmit}
                loading={GallerySubmit}
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

export { GallerySidebar };
