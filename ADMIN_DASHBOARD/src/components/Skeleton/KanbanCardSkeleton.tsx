import { Skeleton } from "primereact/skeleton";


const myArray: any = [
    { id: 1, name: "Object 1" },
    { id: 2, name: "Object 2" },
    { id: 3, name: "Object 3" },
    { id: 4, name: "Object 4" },
    { id: 5, name: "Object 5" },
    { id: 6, name: "Object 6" },
];


export const KanbanCardSkeleton = ( props: any ) => {


    const dynamicColumns = myArray.map( ( item: any, idex: any ) => {
        return (
            <Skeleton
                width="20rem"
                height="6rem"
                key={ item.id }
            >
            </Skeleton>
        );
    } );

    return (

        <div className="w-full mr-3">
            { dynamicColumns }
        </div>
    );
}