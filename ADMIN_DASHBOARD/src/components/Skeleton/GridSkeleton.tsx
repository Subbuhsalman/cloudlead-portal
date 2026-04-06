import { Skeleton } from 'primereact/skeleton';

export const GridSkeleton = (props: any) => {
  const list: any = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];

  return (
    <div className="grid gutter">
      {list.map((course: any, index: number) => {
        return (
          <div key={index} className=" col-3 md:col-6 xl:col-3 p-3 ">
            <div className='card p-3'>
              <Skeleton width="100%" height="150px"></Skeleton>
              <div className="flex justify-content-between mt-3">
                <Skeleton width="45%" height="2rem"></Skeleton>
                <Skeleton width="45%" height="2rem"></Skeleton>
              </div>
              <div className="flex justify-content-between mt-3">
                <Skeleton width="45%" height="2rem"></Skeleton>
                <Skeleton width="45%" height="2rem"></Skeleton>
              </div>
              <div className="flex justify-content-between mt-3">
                <Skeleton width="45%" height="2rem"></Skeleton>
                <Skeleton width="45%" height="2rem"></Skeleton>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
