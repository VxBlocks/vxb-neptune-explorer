import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OverviewState, StatsState } from "../types";
import { queryOverviewData, queryStatsGuesserChartData, queryStatsRewardChartData, queryStatsTargetChartData } from "@/utils/api/apis";
import { GuessertChart, Overview, RewardChart, TargetChart } from "@/utils/api/types";

const initialState: StatsState = {
    loadingReward: false,
    rewardChartDatas: [],

    loadingTarget: false,
    targetChartDatas: [],

    loadingGuesser: false,
    guesserChartDatas: []
}

const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(requestTargetChartData.pending, (state, action) => {
            state.loadingTarget = true;
        });
        builder.addCase(requestTargetChartData.rejected, (state, action) => {
            state.loadingTarget = false;
        });
        builder.addCase(requestTargetChartData.fulfilled, (state, action) => {
            state.loadingTarget = false;
            state.targetChartDatas = action.payload.data;
        });

        builder.addCase(requestRewardChartData.pending, (state, action) => {
            state.loadingReward = true;
        });
        builder.addCase(requestRewardChartData.rejected, (state, action) => {
            state.loadingReward = false;
        });
        builder.addCase(requestRewardChartData.fulfilled, (state, action) => {
            state.loadingReward = false;
            state.rewardChartDatas = action.payload.data;
        });


        builder.addCase(requestGuesserChartData.pending, (state, action) => {
            state.loadingGuesser = true;
        });
        builder.addCase(requestGuesserChartData.rejected, (state, action) => {
            state.loadingGuesser = false;
        });
        builder.addCase(requestGuesserChartData.fulfilled, (state, action) => {
            state.loadingGuesser = false;
            state.guesserChartDatas = action.payload.data;
        });


    }
})

export const requestTargetChartData = createAsyncThunk<
    { data: TargetChart[] },
    { duration: string }
>(
    '/api/stats/requestTargetChartData',
    async ({ duration }) => {
        const res = await queryStatsTargetChartData({ duration });
        const data = res.data.chart;
        return {
            data,
        }
    }
)

export const requestGuesserChartData = createAsyncThunk<
    { data: GuessertChart[] },
    { duration: string }
>(
    '/api/stats/requestGuesserChartData',
    async ({ duration }) => {
        const res = await queryStatsGuesserChartData({ duration });
        const data = res.data.chart;
        return {
            data,
        }
    }
)

export const requestRewardChartData = createAsyncThunk<
    { data: RewardChart[] },
    { duration: string }
>(
    '/api/stats/requestRewardChartData',
    async ({ duration }) => {
        const res = await queryStatsRewardChartData({ duration });
        const data = res.data.chart;
        return {
            data,
        }
    }
)

export const {
} = statsSlice.actions;

export default statsSlice.reducer;