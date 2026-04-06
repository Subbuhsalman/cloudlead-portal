
import React from 'react';
import { Skeleton } from 'primereact/skeleton';

export const OrganizationChartSkeleton = () => {
    return (
        <div className="p-organizationchart">
            <div className="p-organizationchart-node">
                <Skeleton shape="circle" size="4rem"></Skeleton>
                <div className="p-organizationchart-node-content">
                    <Skeleton width="8rem" className="mb-2"></Skeleton>
                    <Skeleton width="6rem"></Skeleton>
                </div>
            </div>
            <div className="p-organizationchart-node">
                <Skeleton shape="circle" size="4rem"></Skeleton>
                <div className="p-organizationchart-node-content">
                    <Skeleton width="8rem" className="mb-2"></Skeleton>
                    <Skeleton width="6rem"></Skeleton>
                </div>
            </div>
            <div className="p-organizationchart-node">
                <Skeleton shape="circle" size="4rem"></Skeleton>
                <div className="p-organizationchart-node-content">
                    <Skeleton width="8rem" className="mb-2"></Skeleton>
                    <Skeleton width="6rem"></Skeleton>
                </div>
            </div>
            <div className="p-organizationchart-node">
                <Skeleton shape="circle" size="4rem"></Skeleton>
                <div className="p-organizationchart-node-content">
                    <Skeleton width="8rem" className="mb-2"></Skeleton>
                    <Skeleton width="6rem"></Skeleton>
                </div>
            </div>
        </div>
    );
};
