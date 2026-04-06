import { useEffect,useState } from "react";
import { useProductHook } from ".";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";
import { useGlobalHook, useHttp } from "@/hooks";
import { useTranslation } from 'react-i18next';
import { FormSkeleton } from "@/components/Skeleton/FormSkeleton";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

type Props = {
  productId?: number | null,
  setProductId?: (value: number | null) => void,
  setShowSidebar: (value: boolean) => void
}

const ProductSidebar = (props: Props) => {
  const {
    saveForm,
    updateForm,
    ProductLoading,
    ProductSubmit,
    getSelectedProductById,
    clearProductDataHook,
    getProductByIdFromStore,
  } = useProductHook();
  const { updateGlobalToast } = useGlobalHook();
  const [isSaveAndExit, setIsSaveAndExit] = useState<boolean>(false);
  const [products, setProducts] = useState<any>([]);
  const { productId = null, setProductId = () =>{}, setShowSidebar = () =>{}} = props;
  const { t } = useTranslation();
  function getProducts(){
    const db =  new useHttp();
    db.get('/product').then((response:any) => {
      setProducts(response.data); 
    }).catch((error) => {
      console.error(error);
    });
  }
  function toSnakeCase(str:string) {
    const matches = str?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
    return matches ? matches.map(x => x.toLowerCase()).join('_') : '';
  }

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
      product_name: "",
    },
    validate: (data: any) => {
      const errors: any = {};

      if (!data.product_name) {
        errors.product_name = `${t('product_name is required.')}`;
      }
      return errors;
    },
    onSubmit: (data: any) => {
      console.log('data,data',data);
      const formPostData = {
        product_name: data.product_name,
        dependant_product_id: data?.dependant_product?.product_id || null,
        product_unique_identifier: toSnakeCase(data.product_name),
        product_price: data.product_price || null,
        product_description: null,
      };

      if (productId) {
        updateForm(productId, formPostData, ()=>{},isSaveAndExit, setShowSidebar);
      } else {
        saveForm(formPostData, formik.resetForm,isSaveAndExit, setShowSidebar);
      }
    },
  });

  useEffect(() => {
    if (productId && getProductByIdFromStore === null) {
      getSelectedProductById(productId);
    } else {
      formik.setFieldValue(
        "product_name",
        getProductByIdFromStore?.product_name
          ? getProductByIdFromStore?.product_name
          : ""
      );
      formik.setFieldValue(
        "product_price",
        getProductByIdFromStore?.product_price
          ? getProductByIdFromStore?.product_price
          : 0.00
      );
    }
  }, [getProductByIdFromStore, formik, getSelectedProductById, productId]);

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
useEffect(() => { 
  console.log('products',products);

  if(products.length ===0){
    getProducts();
  }

  if(getProductByIdFromStore?.parent_product?.product_id){

    const selectedProduct = products.find((product:any) => product.product_id === getProductByIdFromStore?.parent_product?.product_id);
    console.log('selectedProduct',selectedProduct);
    formik.setFieldValue("dependant_product", selectedProduct);
  }
  

},[products,getProductByIdFromStore, formik])
  return (
    <>
    
    <div className="card">
        <div className="text-3xl font-medium text-900 mb-3">
        {productId ? `${t('Edit Product')}` : `${t('Add New Product')}`}
        </div>
      
        <hr />
      
      {ProductLoading ? (
        <FormSkeleton />
      ) : (
        
        <form onSubmit={formik.handleSubmit}>
          <div className="grid p-fluid">
            <div className="col-12">
              <div className="scroll-height-300 mb-5">
                <div className="field">
                  <label className="block">
                    <span className="must-required">*</span>&nbsp;<span>{t('Product')}</span>
                  </label>
                  <InputText
                    placeholder={t('Enter Product')}
                    id="product_name"
                    name="product_name"
                    value={formik.values.product_name || ""}
                    onChange={formik.handleChange}
                    className={classNames({
                      invalid: isFormFieldValid("product_name"),
                    })}
                  />
                  {getFormErrorMessage("product_name")}
                </div>
                <div className="field">
                  <label className="block">
                    <span className="must-required">*</span>&nbsp;<span>{t('Unique Identifier')}</span>
                  </label>
                  <InputText
                  disabled
                    placeholder={t('Enter products unique identifier')}
                    id="product_unique_identifier"
                    name="product_unique_identifier"
                    value={toSnakeCase(formik.values.product_name) || ""}
                    onChange={formik.handleChange}
                    className={classNames({
                      invalid: isFormFieldValid("product_unique_identifier"),
                    })}
                  />
                  {getFormErrorMessage("product_unique_identifier")}
                </div>
                <div className="field">
                  <label className="block">
                    <span className="must-required">*</span>&nbsp;<span>{t('Product price')}</span>
                  </label>
                  <InputNumber
                      inputId="product_price"
                      name="product_price"
                      value={ formik.values.product_price }
                      onChange={ ( e: any ) => {
                        formik.setFieldValue( "product_price", e.value )
                      } }
                      onValueChange={ ( e: any ) => {
                        formik.setFieldValue( "product_price", e.value )
                      } }
                      mode="currency"
                      currency="USD"
                      locale="en-US"
                    />
                  {getFormErrorMessage("product_price")}
                </div>
                <div className="field">
                  <label className="block">
                    <span className="must-required">*</span>&nbsp;<span>{t('Dependent product ')}</span>
                  </label>
                  <Dropdown
                      inputId="dependant_product"
                      name="dependant_product"
                      options={products}
                      value={ formik.values.dependant_product }
                      optionLabel="product_name"
                      onChange={ ( e: any ) => {
                        formik.setFieldValue( "dependant_product", e.value )
                      } }
                     
                    />
                  {getFormErrorMessage("dependant_product")}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 py-3 surface-100 text-right sidebar-footer">
            <div className="text-right">
              <Button
              text
                onClick={() => {
                  setProductId(null);
                  clearProductDataHook();
                  setShowSidebar(false)}}
                icon="pi pi-times"
                type="button"
                label={t('Cancel')}
                className=" p-button-danger p-component mr-3"
                disabled={ProductSubmit}
              />
              <Button
                type="submit"
                label={productId ? `${t('Update Product')}` : `${t('Save & Next')}`}
                className="p-button p-button-primary p-button-outlined mr-3"
                disabled={ProductSubmit}
                loading={ProductSubmit}
                onClick={() => {
                  if (Object.keys(formik.errors).length !== 0) {
                    validationToast();
                   
                  } else {
                    setIsSaveAndExit(false)
                  }
                  formik.handleSubmit();
                }}
              />
              {!productId &&               
              <Button
                type="submit"
                label={productId ? `${t('Update Product')}` : `${t('Save & Exit')}`}
                className="p-button p-button-primary"
                disabled={ProductSubmit}
                loading={ProductSubmit}
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

export { ProductSidebar };
