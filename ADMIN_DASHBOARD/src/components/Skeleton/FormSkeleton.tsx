import { Skeleton } from "primereact/skeleton";

export const FormSkeleton = (props: any) => {
 

  return (
    <div>
      <div className="card">
     
        <Skeleton height="2rem" className="mb-4"></Skeleton>

        <Skeleton height="2rem" className="mb-4"></Skeleton>
      
      </div>
    </div>
  );
};
