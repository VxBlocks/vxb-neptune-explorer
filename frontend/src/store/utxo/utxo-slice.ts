import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UtxoState } from "../types";
import { queryUtxoList } from "@/utils/api/apis";
import { UtxoData } from "@/utils/api/types";

const initialState: UtxoState = {
    loadingLatestUtxo: false,
    latestUtxoDatas: [],

    loadingUtxo: false,
    utxoDatas: [],
    utxoPage: 1,
    utxoTotalPage: 0
}

const utxoSlice = createSlice({
    name: "stutxoats",
    initialState,
    reducers: {
        setUtxoPage: (state, action) => {
            state.utxoPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(requestLatestUtxos.pending, (state, action) => {
            state.loadingLatestUtxo = true;
        });
        builder.addCase(requestLatestUtxos.rejected, (state, action) => {
            state.loadingLatestUtxo = false;
        });
        builder.addCase(requestLatestUtxos.fulfilled, (state, action) => {
            state.loadingLatestUtxo = false;
            state.latestUtxoDatas = action.payload.data;
        }); 
        builder.addCase(requestAllUtxos.pending, (state, action) => {
            state.loadingUtxo = true;
        });
        builder.addCase(requestAllUtxos.rejected, (state, action) => {
            state.loadingUtxo = false;
        });
        builder.addCase(requestAllUtxos.fulfilled, (state, action) => {
            state.loadingUtxo = false;
            state.utxoDatas = action.payload.data;
            state.utxoTotalPage = action.payload.total;
        });

    }
})

export const requestLatestUtxos = createAsyncThunk<
    { data: UtxoData[] }
>(
    '/api/utxo/requestLatestUtxos',
    async () => {
        const res = await queryUtxoList({
            page: 0,
            size: 5
        });
        const data = res.data.utxos;
        return {
            data,
        }
    }
)

export const requestAllUtxos = createAsyncThunk<
    { data: UtxoData[], total: number },
    { page: number }
>(
    '/api/utxo/requestAllUtxos',
    async ({ page }) => {
        const res = await queryUtxoList({
            page: page - 1,
            size: 10
        });
        const data = res.data.utxos;
        const total = res.data.count as number; 
        return {
            data,
            total,
        }
    }
)



export const {
    setUtxoPage
} = utxoSlice.actions;

export default utxoSlice.reducer;