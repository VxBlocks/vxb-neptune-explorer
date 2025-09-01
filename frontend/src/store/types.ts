import { Block, BlockDetail, GuessertChart, Overview, RewardChart, RpcBlock, TargetChart, TransactionData, UtxoData, WsBlock } from "@/utils/api/types";

export interface BlockState {
    loadingLatestBlocks: boolean;
    latestBlocks: Block[]
    loadingBlockInfo: boolean;
    blockInfo: BlockDetail | null;

    loadingBlocks: boolean;
    blocks: Block[],
    blocksPage: number,
    blocksTotalPage: number

    wsClientBlockData: WsBlock | null

    rpcBlockData: RpcBlock | null

    loadingForkList: boolean;
    forkList: Block[]
    forksPage: number,
    forksTotalPage: number
}

export interface OverviewState {
    loadingOverview: boolean;
    overviewData: Overview | null
}

export interface StatsState {
    loadingReward: boolean;
    rewardChartDatas: RewardChart[]
    loadingTarget: boolean;
    targetChartDatas: TargetChart[]

    loadingGuesser: boolean;
    guesserChartDatas:GuessertChart[]
}

export interface UtxoState {
    loadingLatestUtxo: boolean;
    latestUtxoDatas: UtxoData[]

    loadingUtxo: boolean;
    utxoDatas: UtxoData[]
    utxoPage: number,
    utxoTotalPage: number
}


export interface TransactionsState {
    loadingLatestTxs: boolean;
    latestTxDatas: TransactionData[]

    loadingAllTxs: boolean;
    transactionDatas: TransactionData[]
    txPage: number,
    txTotal: number

    loadingTxDetail: boolean;
    txDetail: TransactionData | null

    loadingBlockTxs: boolean;
    blockTxDatas: TransactionData[]
}