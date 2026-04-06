import { Skeleton } from "primereact/skeleton";

const MenuListSkeleton = () => {
  const lines: any = [];
  lines.length = 10;
  lines.fill(10);
  return (
    <div className="field col-12 md:col-6">
      <div className="custom-skeleton 4">
        <ul className="m-0 0" style={{ listStyle: "none" }}>
          {lines.map((line: any, index: any) => (
            <li key={index} className="mb-3">
              <div className="flex">
                <div style={{ flex: "1" }}>
                  <Skeleton className="menu-list-line"></Skeleton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

MenuListSkeleton.propTypes = {};

export { MenuListSkeleton };
