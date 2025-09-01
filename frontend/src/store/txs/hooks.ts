import { useAppSelector } from "@/store/hooks";


export const useLoadingLatestTxs = () => {
    return useAppSelector(state => state.txs.loadingLatestTxs);
}
export const useLatestTxDatas = () => {
    return useAppSelector(state => state.txs.latestTxDatas);
}
export const useLoadingAllTxs = () => {
    return useAppSelector(state => state.txs.loadingAllTxs);
}
export const useTransactionDatas = () => {
    return useAppSelector(state => state.txs.transactionDatas);
}
export const useTransactionPage = () => {
    return useAppSelector(state => state.txs.txPage);
}
export const useTransactionTotal = () => {
    return useAppSelector(state => state.txs.txTotal);
}
export const useLoadingTxDetail = () => {
    return useAppSelector(state => state.txs.loadingTxDetail);
}
export const useTxDetail = () => {
    return useAppSelector(state => state.txs.txDetail);
}

export const useLoadingBlockTxs = () => {
    return useAppSelector(state => state.txs.loadingBlockTxs);
}
export const useBlockTxDatas = () => {
    return useAppSelector(state => state.txs.blockTxDatas);
}