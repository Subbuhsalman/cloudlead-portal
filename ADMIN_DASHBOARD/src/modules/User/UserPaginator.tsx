import React, { useState, useEffect } from "react";
import { Paginator } from "primereact/paginator";
import { Ripple } from "primereact/ripple";
import { Dropdown } from "primereact/dropdown";
import { useUserHook } from "./UserHook";

const UserPaginator = () => {
  const [paginatorFirst, setPaginatorFirst] = useState<number>(0);
  const {
    getPaginatedUserList,
    updateUserPaginated,
    UserFilter,
    UserPage,
    UserPerPage,
    UserTotalRecords,
    UserLoading
  } = useUserHook();

  const onBasicPageChange = (event: any) => {
    setPaginatorFirst(event.first);

    updateUserPaginated({
      page: event.page + 1,
      per_page: event.rows,
    });
  };

  useEffect(() => {
    getPaginatedUserList();
  }, [UserPerPage, UserFilter, UserPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const paginatorTemplate: any = {
    layout:
      "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
    FirstPageLink: (options: any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-paginator-icon pi pi-angle-double-left"></span>
          <Ripple />
        </button>
      );
    },
    PrevPageLink: (options: any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-paginator-icon pi pi-angle-left"></span>
          <Ripple />
        </button>
      );
    },
    NextPageLink: (options: any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-paginator-icon pi pi-angle-right"></span>
          <Ripple />
        </button>
      );
    },
    LastPageLink: (options: any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-paginator-icon pi pi-angle-double-right"></span>
          <Ripple />
        </button>
      );
    },
    PageLinks: (options: any) => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        const className = options.className;
        return (
          <span className={className} style={{ userSelect: "none" }}>
            ...
          </span>
        );
      }

      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      );
    },
    RowsPerPageDropdown: (options: any) => {
      const dropdownOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
      ];

      return (
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={options.onChange}
        />
      );
    },
    CurrentPageReport: (options: any) => {
      return (
        <span
          className="p-paginator-current"
          style={{ color: "var(--text-color)", userSelect: "none" }}
        >
          Showing {options.first} to {options.last} of {options.totalRecords} entries
        </span>
      );
    },
  };

  return (
    <div className="flex justify-center mt-4">
      <Paginator
        first={paginatorFirst}
        rows={UserPerPage}
        totalRecords={UserTotalRecords}
        onPageChange={onBasicPageChange}
        template={paginatorTemplate}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </div>
  );
};

export { UserPaginator };
