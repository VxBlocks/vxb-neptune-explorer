import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BlockState } from "../types";
import { queryBlockByRpc, queryBlockDetail, queryBlocks, queryForks, queryLatestBlocks } from "@/utils/api/apis";
import { Block, BlockDetail, RpcBlock } from "@/utils/api/types";

const initialState: BlockState = {
    loadingBlockInfo: false,
    blockInfo: null,
    loadingLatestBlocks: false,
    latestBlocks: [],
    loadingBlocks: false,

    blocks: [],
    blocksPage: 1,
    blocksTotalPage: 0,

    wsClientBlockData: null,
    rpcBlockData: null,

    loadingForkList: false,
    forkList: [],
    forksPage: 1,
    forksTotalPage: 0
}

const blockSlice = createSlice({
    name: "block",
    initialState,
    reducers: {
        setBlocksPage: (state, action) => {
            state.blocksPage = action.payload;
        },
        updateLatestBlock: (state, action) => {
            state.wsClientBlockData = action.payload;
        },
        setForksPage: (state, action) => {
            state.forksPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(requestBlockDetailInfo.pending, (state, action) => {
            state.loadingBlockInfo = true;
        });
        builder.addCase(requestBlockDetailInfo.rejected, (state, action) => {
            state.loadingBlockInfo = false;
            state.blockInfo = null;
        });
        builder.addCase(requestBlockDetailInfo.fulfilled, (state, action) => {
            state.loadingBlockInfo = false;
            state.blockInfo = action.payload.data;
        });
        builder.addCase(requestLatestBlocks.pending, (state, action) => {
            state.loadingLatestBlocks = true;
        });
        builder.addCase(requestLatestBlocks.rejected, (state, action) => {
            state.loadingLatestBlocks = false;
            state.latestBlocks = [];
        });
        builder.addCase(requestLatestBlocks.fulfilled, (state, action) => {
            state.loadingLatestBlocks = false;
            state.latestBlocks = action.payload.data;
        });

        builder.addCase(updateLatestBlocks.fulfilled, (state, action) => {
            state.latestBlocks = action.payload.data;
        });

        builder.addCase(requestBlockListData.pending, (state, action) => {
            state.loadingBlocks = true;
        });
        builder.addCase(requestBlockListData.rejected, (state, action) => {
            state.loadingBlocks = false;
        });
        builder.addCase(requestBlockListData.fulfilled, (state, action) => {
            state.loadingBlocks = false;
            state.blocks = action.payload.data;
            state.blocksTotalPage = action.payload.total;
        });

        builder.addCase(requestForkListData.pending, (state, action) => {
            state.loadingForkList = true;
        });
        builder.addCase(requestForkListData.rejected, (state, action) => {
            state.loadingForkList = false;
        });
        builder.addCase(requestForkListData.fulfilled, (state, action) => {
            state.loadingForkList = false;
            state.forkList = action.payload.data;
            state.forksTotalPage = action.payload.total;
        });

        builder.addCase(requestBlockInfoByRpc.fulfilled, (state, action) => {
            state.rpcBlockData = action.payload.data;
        });

        builder.addCase(requestBlockInfoByHash.pending, (state, action) => {
            state.loadingBlockInfo = true;
        });
        builder.addCase(requestBlockInfoByHash.rejected, (state, action) => {
            state.loadingBlockInfo = false;
            state.rpcBlockData = null;
        });
        builder.addCase(requestBlockInfoByHash.fulfilled, (state, action) => {
            state.loadingBlockInfo = false;
            state.rpcBlockData = action.payload.data;
        });


    }
})

export const requestBlockDetailInfo = createAsyncThunk<
    { data: BlockDetail },
    { height: number }
>(
    '/api/block/requestBlockDetailInfo',
    async ({ height }) => {
        const res = await queryBlockDetail({
            height,
        });
        const data = res.data.detail;
        return {
            data,
        }
    }
)

export const requestLatestBlocks = createAsyncThunk<
    { data: Block[] }
>(
    '/api/block/requestLatestBlocks',
    async () => {
        const res = await queryLatestBlocks({
            page: 0,
            size: 5
        });
        const data = res.data.blocks;
        return {
            data,
        }
    }
)
export const updateLatestBlocks = createAsyncThunk<
    { data: Block[] }
>(
    '/api/block/updateLatestBlocks',
    async () => {
        const res = await queryLatestBlocks({
            page: 0,
            size: 5
        });
        const data = res.data.blocks;
        return {
            data,
        }
    }
)

export const requestBlockListData = createAsyncThunk<
    { data: Block[], total: number },
    { page: number }
>(
    '/api/block/requestBlockListData',
    async ({ page }) => {
        const res = await queryBlocks({
            page: page - 1,
            size: 10
        });
        const data = res.data.blocks;
        const total = res.data.count as number;
        return {
            data,
            total,
        }
    }
)

export const requestForkListData = createAsyncThunk<
    { data: Block[], total: number },
    { page: number }
>(
    '/api/block/requestForkListData',
    async ({ page }) => {
        const res = await queryForks({
            page: page - 1,
            size: 10
        });
        const data = res.data.blocks;
        const total = res.data.count as number;
        return {
            data,
            total,
        }
    }
)


export const requestBlockInfoByRpc = createAsyncThunk<
    { data: RpcBlock },
    { block: string }
>(
    '/api/block/requestBlockInfoByRpc',
    async ({ block }) => {
        const res = await queryBlockByRpc({ blockOrHash: block });
        const data = res.data
        return {
            data
        }
    }
)

export const requestBlockInfoByHash = createAsyncThunk<
    { data: RpcBlock },
    { hash: string }
>(
    '/api/block/requestBlockInfoByHash',
    async ({ hash }) => {
        const res = await queryBlockByRpc({ blockOrHash: hash });
        const data = res.data
        return {
            data
        }
    }
)

export const {
    setBlocksPage,
    setForksPage,
    updateLatestBlock
} = blockSlice.actions;

export default blockSlice.reducer;