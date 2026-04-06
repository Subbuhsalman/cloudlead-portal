
import React, { useEffect } from "react";
import { useGalleryHook } from ".";
import { useTranslation } from 'react-i18next';

type Props = {
  galleryId: number | null,
  setGalleryId: (id:number|null) => void
}
const GalleryModal = (props: Props) => {
  const {

    getSelectedGalleryById,
    clearGalleryDataHook,
    getGalleryByIdFromStore,
  } = useGalleryHook();

  const { galleryId = null, setGalleryId = () =>{} } = props;
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (galleryId && getGalleryByIdFromStore === null) {
      getSelectedGalleryById(galleryId);
    } 

    return () => {
      if (galleryId) {
        clearGalleryDataHook();
        setGalleryId(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGalleryByIdFromStore]);





  return (
    <>
      <p>Create your content here</p>
    </>
  );
};

export { GalleryModal };
