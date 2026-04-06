import { Skeleton } from "primereact/skeleton";

export const ChartSkeleton = (props: any) => {
  const list: any = [1,2,3,1,2,3,1,2,3,1,2,3]

  return (
      <div className="grid">
      {list.map((course: any, index: number) => {

        return (

      <div key={index} className="col-12 lg:col-4  md:col-12  sm:col-12  " >
          <Skeleton width="100%" height="250px"></Skeleton>
          {/* <div className="flex justify-content-between mt-3">
              <Skeleton width="45%" height="2rem"></Skeleton>
          
          </div>
          <div className="flex justify-content-between mt-3">
              <Skeleton width="45%" height="2rem"></Skeleton>
             
          </div>
          <div className="flex justify-content-between mt-3">
              <Skeleton width="45%" height="2rem"></Skeleton>
            
          </div> */}
      </div>
        )

        })}
        </div>
  );
};
