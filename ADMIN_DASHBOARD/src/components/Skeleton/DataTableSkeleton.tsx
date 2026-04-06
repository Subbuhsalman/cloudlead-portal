import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";

import React from "react";

export const DataTableSkeleton = (props: any) => {
  const { columns } = props;

  // const tableElements = Array.from({ length: 5 }, (_, i) => i);

  const tableElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    hr_starter_id:``,
    created_at:``
  }));

  const bodyTemplate = (e:any, row:any) => {
    return <Skeleton key={`rowIndex_${row?.field}_${row?.rowIndex}`}></Skeleton>;
  };
 

  const dynamicColumns = columns.map((col: any, i: any) => {
    return (
      <Column
        key={`${col.field}_${i}`}
        field="code"
        header={col.header}
        style={{ width: "10%" }}
        body={bodyTemplate}
        
      ></Column>
    );
  });

  return (
    <div className="card">
     
        <DataTable value={tableElements} >
          {dynamicColumns}
        </DataTable>
     
    </div>
  );
};
