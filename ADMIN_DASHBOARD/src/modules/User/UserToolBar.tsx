import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useTranslation } from 'react-i18next';

export const UserToolBar = (props: any) => {
  const {
    heading,
    showSearchFilter = true,
    showLayoutBtns = false,
    changeLayout,
    layoutType,
    onSearch,
    searchValue,
    onSearchChange,
  } = props;
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl font-bold">{heading}</h2>
      </div>
      <div className="flex gap-2">
        {showSearchFilter && (
          <div className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={t('Search users...')}
              className="p-inputtext-sm"
            />
          </div>
        )}
        {showLayoutBtns && (
          <div className="flex gap-1">
            <Button
              icon="pi pi-list"
              className={`p-button-sm ${layoutType === 'table' ? 'p-button-info' : 'p-button-secondary'}`}
              onClick={() => changeLayout && changeLayout('table')}
              tooltip={t('Table View')}
            />
            <Button
              icon="pi pi-th-large"
              className={`p-button-sm ${layoutType === 'grid' ? 'p-button-info' : 'p-button-secondary'}`}
              onClick={() => changeLayout && changeLayout('grid')}
              tooltip={t('Grid View')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
