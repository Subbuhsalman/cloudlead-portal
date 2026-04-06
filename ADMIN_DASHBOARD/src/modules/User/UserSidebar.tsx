import React from "react";
import { useTranslation } from 'react-i18next';

export const UserSidebar = (props: any) => {
  const { setShowSidebar } = props;
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">{t('User Details')}</h3>
      <p className="text-gray-600">
        {t('This is a read-only view. To add credits to users, use the "Add Credits" button in the table.')}
      </p>
      <div className="mt-4">
        <button
          className="p-button p-component p-button-secondary"
          onClick={() => setShowSidebar(false)}
        >
          {t('Close')}
        </button>
      </div>
    </div>
  );
};
