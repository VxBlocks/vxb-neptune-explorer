
import service, { url } from "@/utils/api/service";



export const queryBlockDetail = ({
    height,
}: {
    height: number,
}) => {
    return service({
        url: url(`/api/block/${height}`),
        method: "GET",
    });
}

export const queryLatestBlocks = ({
    page,
    size,
}: {
    page: number,
    size: number,
}) => {
    return service({
        url: url(`/api/blocks`),
        method: "GET",
        params: {
            page,
            page_size: size,
        }
    });
}

export const queryBlocks = ({
    page,
    size,
}: {
    page: number,
    size: number,
}) => {
    return service({
        url: url(`/api/blocks`),
        method: "GET",
        params: {
            page,
            page_size: size,
        }
    });
}

export const queryForks = ({
    page,
    size,
}: {
    page: number,
    size: number,
}) => {
    return service({
        url: url(`/api/forks`),
        method: "GET",
        params: {
            page,
            page_size: size,
        }
    });
}

export const queryUtxoList = ({
    page,
    size,
}: {
    page: number,
    size: number,
}) => {
    return service({
        url: url(`/api/utxo/list`),
        method: "GET",
        params: {
            page,
            pageSize: size,
        }
    });
}

export const queryTransactions = ({
    page,
    size,
}: {
    page: number,
    size: number,
}) => {
    return service({
        url: url(`/api/tx/list`),
        method: "GET",
        params: {
            page,
            pageSize: size,
        }
    });
}


export const queryTransactionById = ({
    txid,
}: {
    txid: string,
}) => {
    return service({
        url: url(`/api/tx/${txid}`),
        method: "GET",
    });
}


export const queryTransactionByBlock = ({
    height,
}: {
    height: number,
}) => {
    return service({
        url: url(`/api/transaction/by_height/${height}`),
        method: "GET",
    });
}




export const queryOverviewData = () => {
    return service({
        url: url(`/api/overview`),
        method: "GET",
    });
}

export const queryStatsTargetChartData = ({
    duration,
}: {
    duration: string,
}) => {
    return service({
        url: url(`/api/trend/target`),
        method: "GET",
        params: {
            duration,
        }
    });
}

export const queryStatsGuesserChartData = ({
    duration,
}: {
    duration: string,
}) => {
    return service({
        url: url(`/api/trend/fee`),
        method: "GET",
        params: {
            duration,
        }
    });
}

export const queryStatsRewardChartData = ({
    duration,
}: {
    duration: string,
}) => {
    return service({
        url: url(`/api/trend/reward`),
        method: "GET",
        params: {
            duration,
        }
    });
}
export const queryBlockByRpc = ({
    blockOrHash,
}: {
    blockOrHash: string,
}) => {
    return service({
        url: url(`/api/rpc/block/${blockOrHash}`),
        method: "GET",
    });
}

export const querySearchApi = ({
    searchValue,
}: {
    searchValue: string,
}) => {
    return service({
        url: url(`/api/search`),
        method: "GET",
        params: {
            q: searchValue,
        }
    }
    );
} 