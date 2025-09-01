import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TransactionsState } from "../types";
import { queryTransactionByBlock, queryTransactionById, queryTransactions } from "@/utils/api/apis";
import { TransactionData } from "@/utils/api/types";

const initialState: TransactionsState = {
    loadingLatestTxs: false,
    latestTxDatas: [],
    loadingAllTxs: false,
    transactionDatas: [],
    txPage: 1,
    txTotal: 0,

    txDetail: null,
    loadingTxDetail: false,

    loadingBlockTxs: false,
    blockTxDatas: []
}

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        setTxPage: (state, action) => {
            state.txPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(requestLatestTxs.pending, (state, action) => {
            state.loadingLatestTxs = true;
        });
        builder.addCase(requestLatestTxs.rejected, (state, action) => {
            state.loadingLatestTxs = false;
        });
        builder.addCase(requestLatestTxs.fulfilled, (state, action) => {
            state.loadingLatestTxs = false;
            state.latestTxDatas = action.payload.data;
        });
        builder.addCase(requestAllTxs.pending, (state, action) => {
            state.loadingAllTxs = true;
        });
        builder.addCase(requestAllTxs.rejected, (state, action) => {
            state.loadingAllTxs = false;
        });
        builder.addCase(requestAllTxs.fulfilled, (state, action) => {
            state.loadingAllTxs = false;
            state.transactionDatas = action.payload.data;
            state.txTotal = action.payload.total;
        });

        builder.addCase(requestTransactionDetail.pending, (state, action) => {
            state.loadingTxDetail = true;
        });
        builder.addCase(requestTransactionDetail.rejected, (state, action) => {
            state.loadingTxDetail = false;
        });
        builder.addCase(requestTransactionDetail.fulfilled, (state, action) => {
            state.loadingTxDetail = false;
            state.txDetail = action.payload.data;
        });

        builder.addCase(requestTransactionByHeight.pending, (state, action) => {
            state.loadingBlockTxs = true;
        });
        builder.addCase(requestTransactionByHeight.rejected, (state, action) => {
            state.loadingBlockTxs = false;
        });
        builder.addCase(requestTransactionByHeight.fulfilled, (state, action) => {
            state.loadingBlockTxs = false;
            state.blockTxDatas = action.payload.data;
        });

    }
})

export const requestLatestTxs = createAsyncThunk<
    { data: TransactionData[] }
>(
    '/api/txs/requestLatestTxs',
    async () => {
        const res = await queryTransactions({
            page: 0,
            size: 5
        });
        const data = res.data.txs;
        return {
            data,
        }
    }
)

export const requestAllTxs = createAsyncThunk<
    {
        data: TransactionData[],
        total: number
    }, {
        page: number
    }
>(
    '/api/txs/requestAllTxs',
    async ({ page }) => {
        const res = await queryTransactions({
            page: page - 1,
            size: 10
        });
        const data = res.data.txs;
        const total = res.data.count as number;
        return {
            data,
            total,
        }
    }
)

export const requestTransactionDetail = createAsyncThunk<
    {
        data: TransactionData,
    }, {
        txid: string
    }
>(
    '/api/txs/requestTransactionDetail',
    async ({ txid }) => {
        const res = await queryTransactionById({ txid });
        const data = res.data.tx;
        return {
            data
        }
    }
)

export const requestTransactionByHeight = createAsyncThunk<
    {
        data: TransactionData[],
    }, {
        height: number
    }
>(
    '/api/txs/requestTransactionByHeight',
    async ({ height }) => {
        const res = await queryTransactionByBlock({ height });
        const data = res.data.txs;
        return {
            data
        }
    }
)




export const {
    setTxPage
} = transactionSlice.actions;

export default transactionSlice.reducer;