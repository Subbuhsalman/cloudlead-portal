// import { useEffect,useState } from "react";
// import { usePostHook } from ".";
// import { useFormik } from "formik";
// import { classNames } from "primereact/utils";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { FormSkeleton } from "@/component/Skeleton/FormSkeleton";
// import { useGlobalHook } from "@/hooks";
// import { useTranslation } from 'react-i18next';

// type Props = {
//   postId?: number | null,
//   setPostId?: (value: number | null) => void,
//   setShowSidebar: (value: boolean) => void
// }

// const PostSidebar = (props: Props) => {
//   const {
//     saveForm,
//     updateForm,
//     PostLoading,
//     PostSubmit,
//     getSelectedPostById,
//     clearPostDataHook,
//     getPostByIdFromStore,
//   } = usePostHook();
//   const { updateGlobalToast } = useGlobalHook();
//   const [isSaveAndExit, setIsSaveAndExit] = useState<boolean>(false);
//   const { postId = null, setPostId = () =>{}, setShowSidebar = () =>{}} = props;
//   const { t } = useTranslation();
//   useEffect(() => {
//     if (postId && getPostByIdFromStore === null) {
//       getSelectedPostById(postId);
//     } else {
//       formik.setFieldValue(
//         "post_title",
//         getPostByIdFromStore?.post_title
//           ? getPostByIdFromStore?.post_title
//           : ""
//       );
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [getPostByIdFromStore]);

//   const validationToast = () => {
//     updateGlobalToast({
//       showToast: true,
//       toastMessage: "Error! Please fill in all the fields with * before them.",
//       toastDetail: null,
//       toastType: "error",
//     });
//   };

//   const formik: any = useFormik({
//     initialValues: {
//       post_title: "",
//     },
//     validate: (data: any) => {
//       const errors: any = {};

//       if (!data.post_title) {
//         errors.post_title = `${t('post_title is required.')}`;
//       }
//       return errors;
//     },
//     onSubmit: (data: any) => {
//       const formPostData = {
//         post_title: data.post_title,
//       };

//       if (postId) {
//         updateForm(postId, formPostData, formik.resetForm,isSaveAndExit, setShowSidebar);
//       } else {
//         saveForm(formPostData, formik.resetForm,isSaveAndExit, setShowSidebar);
//       }
//     },
//   });

//   const isFormFieldValid = (name: any) => {
//     return !!(formik.touched[name] && formik.errors[name]);
//   };
//   const getFormErrorMessage = (name: any) => {
//     return (
//       isFormFieldValid(name) && (
//         <small className="block error">{formik.errors[name]}</small>
//       )
//     );
//   };

//   return (
//     <>
    
//     <div className="card">
//         <div className="text-3xl font-medium text-900 mb-3">
//         {postId ? `${t('Edit Post')}` : `${t('Add New Post')}`}
//         </div>
//         <div className="font-medium text-500 mb-3">
//           Post text here
//         </div>
//         <hr />
      
//       {PostLoading ? (
//         <FormSkeleton />
//       ) : (
        
//         <form onSubmit={formik.handleSubmit}>
//           <div className="grid p-fluid">
//             <div className="col-12">
//               <div className="scroll-height-300 mb-5">
//                 <div className="field">
//                   <label className="block">
//                     <span className="must-required">*</span>&nbsp;<span>{t('Post')}</span>
//                   </label>
//                   <InputText
//                     placeholder={t('Enter Post')}
//                     id="post_title"
//                     name="post_title"
//                     value={formik.values.post_title || ""}
//                     onChange={formik.handleChange}
//                     className={classNames({
//                       invalid: isFormFieldValid("post_title"),
//                     })}
//                   />
//                   {getFormErrorMessage("post_title")}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="w-full px-4 py-3 surface-100 text-right sidebar-footer">
//             <div className="text-right">
//               <Button
//               text
//                 onClick={() => setShowSidebar(false)}
//                 icon="pi pi-times"
//                 type="button"
//                 label={t('Cancel')}
//                 className=" p-button-danger p-component mr-3"
//                 disabled={PostSubmit}
//               />
//               <Button
//                 type="submit"
//                 label={postId ? `${t('Update Post')}` : `${t('Save & Next')}`}
//                 className="p-button p-button-primary p-button-outlined mr-3"
//                 disabled={PostSubmit}
//                 loading={PostSubmit}
//                 onClick={() => {
//                   if (Object.keys(formik.errors).length !== 0) {
//                     validationToast();
                   
//                   } else {
//                     setIsSaveAndExit(false)
//                   }
//                   formik.handleSubmit();
//                 }}
//               />
//               {!postId &&               
//               <Button
//                 type="submit"
//                 label={postId ? `${t('Update Post')}` : `${t('Save & Exit')}`}
//                 className="p-button p-button-primary"
//                 disabled={PostSubmit}
//                 loading={PostSubmit}
//                 onClick={() => {
//                   if (Object.keys(formik.errors).length !== 0) {
//                     validationToast();
                    
//                   } else {
//                     setIsSaveAndExit(true)
//                   }
//                   formik.handleSubmit();
//                 }}
//               />
//               }
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//     </>
//   );
// };

// export { PostSidebar };
