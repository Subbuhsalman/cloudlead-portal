// import React, { useState } from 'react';
// import { Dialog } from 'primereact/dialog';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { useFormik } from 'formik';
// import { classNames } from 'primereact/utils';
// import { useTranslation } from 'react-i18next';
// import { useGlobalHook } from '@/hooks';
// import { generatePassword } from '@/utils';

// type Props = {
//   visible: boolean;
//   onHide: () => void;
//   adminUserId: number | null;
//   onPasswordUpdate: (userId: number, newPassword: string) => void;
// };

// const PasswordUpdateModal = ({ visible, onHide, adminUserId, onPasswordUpdate }: Props) => {
//   const { t } = useTranslation();
//   const { updateGlobalToast } = useGlobalHook();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       password: '',
//       confirmPassword: ''
//     },
//     validate: (data) => {
//       const errors: any = {};

//       if (!data.password || data.password.trim() === '') {
//         errors.password = t('Password is required');
//       } else if (data.password.length < 6) {
//         errors.password = t('Password must be at least 6 characters long');
//       }

//       if (!data.confirmPassword || data.confirmPassword.trim() === '') {
//         errors.confirmPassword = t('Please confirm your password');
//       } else if (data.password !== data.confirmPassword) {
//         errors.confirmPassword = t('Passwords do not match');
//       }

//       return errors;
//     },
//     onSubmit: async (data) => {
//       if (adminUserId) {
//         setIsSubmitting(true);
//         try {
//           await onPasswordUpdate(adminUserId, data.password);
//           updateGlobalToast({
//             showToast: true,
//             toastMessage: t('Password updated successfully'),
//             toastDetail: null,
//             toastType: 'success',
//           });
//           formik.resetForm();
//           onHide();
//         } catch (error) {
//           updateGlobalToast({
//             showToast: true,
//             toastMessage: t('Failed to update password'),
//             toastDetail: null,
//             toastType: 'error',
//           });
//         } finally {
//           setIsSubmitting(false);
//         }
//       }
//     }
//   });

//   const isFormFieldValid = (name: string) => {
//     return !!(formik.touched[name] && formik.errors[name]);
//   };

//   const getFormErrorMessage = (name: string) => {
//     return (
//       isFormFieldValid(name) && (
//         <small className="block error">{formik.errors[name]}</small>
//       )
//     );
//   };

//   const generateNewPassword = () => {
//     const newPassword = generatePassword();
//     formik.setFieldValue('password', newPassword);
//     formik.setFieldValue('confirmPassword', newPassword);
//   };

//   return (
//     <Dialog
//       header={t('Update Password')}
//       visible={visible}
//       onHide={onHide}
//       style={{ width: '400px' }}
//       modal
//       footer={
//         <div className="flex justify-end gap-2">
//           <Button
//             label={t('Cancel')}
//             icon="pi pi-times"
//             onClick={onHide}
//             className="p-button-text"
//             disabled={isSubmitting}
//           />
//           <Button
//             label={t('Update Password')}
//             icon="pi pi-check"
//             onClick={formik.handleSubmit}
//             loading={isSubmitting}
//             disabled={isSubmitting}
//           />
//         </div>
//       }
//     >
//       <form onSubmit={formik.handleSubmit}>
//         <div className="field">
//           <label htmlFor="password">
//             <span className="must-required">*</span>&nbsp;{t('New Password')}
//           </label>
//           <div className="p-inputgroup">
//             <InputText
//               id="password"
//               name="password"
//               type="password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               className={classNames({ invalid: isFormFieldValid('password') })}
//               placeholder={t('Enter new password')}
//             />
//             <Button
//               type="button"
//               icon="pi pi-refresh"
//               className="p-button-outlined"
//               onClick={generateNewPassword}
//               tooltip={t('Generate Password')}
//               tooltipOptions={{ position: 'top' }}
//             />
//           </div>
//           {getFormErrorMessage('password')}
//         </div>

//         <div className="field">
//           <label htmlFor="confirmPassword">
//             <span className="must-required">*</span>&nbsp;{t('Confirm Password')}
//           </label>
//           <InputText
//             id="confirmPassword"
//             name="confirmPassword"
//             type="password"
//             value={formik.values.confirmPassword}
//             onChange={formik.handleChange}
//             className={classNames({ invalid: isFormFieldValid('confirmPassword') })}
//             placeholder={t('Confirm new password')}
//           />
//           {getFormErrorMessage('confirmPassword')}
//         </div>
//       </form>
//     </Dialog>
//   );
// };

// export { PasswordUpdateModal };

