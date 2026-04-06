import { Badge } from 'primereact/badge';
import React from 'react'

const StatusBadge = (props: any) => {
    const { status } = props;
    switch (status) {
        case "PENDING":
            return <Badge value={status} severity="warning"></Badge>
        case "SUBMITTED":
            return <Badge value={status} severity="success"></Badge>
       default:
            break;
    }
}

export { StatusBadge }