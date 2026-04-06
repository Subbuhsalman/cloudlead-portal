import { InputText } from 'primereact/inputtext'
import { TreeSelect } from 'primereact/treeselect'
import { classNames } from 'primereact/utils'
import React, { useEffect, useState } from 'react'
import { toSnakeCase, treeNodes } from '../PolicyUtils'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'primereact/dropdown'
import { useHttp } from '@/hooks'

const PolicySidebarLeft = (props:any) => {
  const { formik,selectedNodeKey, setSelectedNodeKey } = props;
  const [products, setProducts] = useState<any[]>([]);
function getProducts(){
    const db =  new useHttp();
    db.get('/product').then((response:any) => {
      setProducts(response.data); 
    }).catch((error) => {
      console.error(error);
    });
  }
    const { t } = useTranslation();
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
    useEffect(()=>{
      if (products.length===0)
       {
      getProducts();
      }
    
    },[products.length])
  return (
      <div className=" card scroll-height-375 mb-5 p-4 border-1 border-round-xl surface-border h-full">
                    <div className="field">
                      <label className="block">
                        <span className="must-required">*</span>&nbsp;<span>{t('Policy')}</span>
                      </label>
                      <InputText
                        placeholder={t('Enter Policy')}
                        id="policy_title"
                        name="policy_title"
                        value={formik.values.policy_title || ""}
                        onChange={formik.handleChange}
                        className={classNames({
                          invalid: isFormFieldValid("policy_title"),
                        })}
                      />
                      {getFormErrorMessage("policy_title")}
                    </div>
                    <div className="field">
                      <label className="block">
                        <span className="must-required">*</span>&nbsp;<span>{t('Policy Unique Identifier')}</span>
                      </label>
                      <InputText
                        placeholder={t('policy unique identifier')}
                        disabled
                        id="policy_title"
                        name="policy_title"
                        value={toSnakeCase(formik.values.policy_title) || ""}
                        onChange={formik.handleChange}
                        className={classNames({
                          invalid: isFormFieldValid("policy_title"),
                        })}
                      />
                      {getFormErrorMessage("policy_title")}
                    </div>
                       <div className="field">
                                      <label className="block">
                                        <span className="must-required">*</span>&nbsp;<span>{t('Product ')}</span>
                                      </label>
                                      <Dropdown
                                          inputId="product"
                                          name="product"
                                          options={products}
                                          value={ formik.values.product }
                                          optionLabel="product_name"
                                          onChange={ ( e: any ) => {
                                            formik.setFieldValue( "product", e.value )
                                          } }
                                         
                                        />
                                      {getFormErrorMessage("product")}
                                    </div>
                    <div className="field">
                      <label className="block">
                        <span className="must-required">*</span>&nbsp;<span>{t('Product')}</span>
                      </label>
                      <TreeSelect value={selectedNodeKey} onChange={(e:any) => setSelectedNodeKey(e.value)} options={treeNodes} 
                    filter className="md:w-20rem w-full" placeholder="Select Item"></TreeSelect>
                      {getFormErrorMessage("policy_title")}
                    </div>
                  </div>
  )
}

export default PolicySidebarLeft