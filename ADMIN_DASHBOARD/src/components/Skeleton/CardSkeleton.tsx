

import React from 'react';
import { Skeleton } from 'primereact/skeleton';

export const CardSkeleton=(props: any)=> {
    return (
        <div className="card">
            <div className="border-round border-1 surface-border p-4 surface-card">
                <div className="flex mb-3">
                    <Skeleton shape="circle" size="8rem" className="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="15rem" className="mb-2"></Skeleton>
                        <Skeleton width="8rem" className="mb-2"></Skeleton>
                        <Skeleton height="2rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="100px"></Skeleton>
                
            </div>
        </div>
    );
}
        