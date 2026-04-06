// eslint-disable-next-line 
import React, { useEffect } from "react";
import { useProductHook } from ".";
import { useTranslation } from 'react-i18next';

type Props = {
  productId: number | null,
  setProductId: (id:number|null) => void
}
const ProductModal = (props: Props) => {
  const {

    getSelectedProductById,
    clearProductDataHook,
    getProductByIdFromStore,
  } = useProductHook();

  const { productId = null, setProductId = () =>{} } = props;
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (productId && getProductByIdFromStore === null) {
      getSelectedProductById(productId);
    } 

    return () => {
      if (productId) {
        clearProductDataHook();
        setProductId(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProductByIdFromStore]);





  return (
    <>
      <p>Create your content here</p>
    </>
  );
};

export { ProductModal };
