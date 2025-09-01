import { useAppSelector } from "@/store/hooks";


export const useLoadingReward = () => {
    return useAppSelector(state => state.stats.loadingReward);
}
export const useLoadingTarget = () => {
    return useAppSelector(state => state.stats.loadingTarget);
}


export const useRewardChartDatas = () => {
    return useAppSelector(state => state.stats.rewardChartDatas);
}
export const useTargetChartDatas = () => {
    return useAppSelector(state => state.stats.targetChartDatas);
}

export const useLoadingGuesser = () => {
    return useAppSelector(state => state.stats.loadingGuesser);
}


export const useGuesserChartDatas = () => {
    return useAppSelector(state => state.stats.guesserChartDatas);
}


