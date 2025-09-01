import { useAppSelector } from "@/store/hooks";


export const useLoadingLatestUtxo = () => {
    return useAppSelector(state => state.utxo.loadingLatestUtxo);
}
export const useLatestUtxoDatas = () => {
    return useAppSelector(state => state.utxo.latestUtxoDatas);
}
export const useLoadingUtxo = () => {
    return useAppSelector(state => state.utxo.loadingUtxo);
}
export const useUtxoDatas = () => {
    return useAppSelector(state => state.utxo.utxoDatas);
}
export const useUtxoPage = () => {
    return useAppSelector(state => state.utxo.utxoPage);
}
export const useUtxoTotalPage = () => {
    return useAppSelector(state => state.utxo.utxoTotalPage);
}