import { useAppSelector } from "@/store/hooks";


export const useLoadingOverview = () => {
    return useAppSelector(state => state.overview.loadingOverview);
}

export const useOverviewData = () => {
    return useAppSelector(state => state.overview.overviewData);
}