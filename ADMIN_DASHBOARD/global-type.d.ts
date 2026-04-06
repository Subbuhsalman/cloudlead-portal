interface DispatchTypeParam {
    type: string;
    payLoad: any
}

type DispatchType = ({
    type,
    payLoad
}:DispatchTypeParam) => void
