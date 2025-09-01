
export interface WsBlock {
    height: number;
    timestamp: string;
    inputs: number;
    outputs: number
}

export interface RpcBlock {
    height: number;
    time: string;
    transactionCount: number;
    digest: string;
    prev_block_digest: string;
    nonce: string;
    cumulative_proof_of_work: string;
    difficulty: string;
    num_inputs: number;
    num_outputs: number;
    inputs: string[];
    outputs: string[];
    num_public_announcements: number;
    coinbase_amount: string;
    fee: string;
    is_canonical: boolean;
    sibling_blocks: string[];
}

export interface SearchBlockResponse {
    block: number;
    block_hash: string;
    coinbase_reward: string;
    fee: string;
    inputs: number;
    outputs: number;
    proof_target: string;
    time: string;

}

export interface SearchTransactionResponse {
    fee: string;
    height: number;
    id: string;
    num_inputs: number;
    num_outputs: number;
    proof_type: string;
    time: string;
}

export interface SearchPutDataResponse {
    height: number;
    id: string;
    txid: string;
}



export interface Block {
    block: number;
    block_hash: string;
    time: string;
    proof_target: string;
    coinbase_reward: string;
    fee: string;
    inputs: number;
    outputs: number;
}


export interface BlockDetail {
    block: number,
    block_coinbase_reward: string,
    block_gas: string,
    block_hash: string,
    is_canonical: boolean,
    target: string,
    time: string
}


export interface Overview {
    average_block_time: number;
    block_hash: string;
    cumulative_proof_of_work: string;
    day_reward: string;
    day_fee: string;
    total_fee: string
    height: number;
    network_speed: string;
    network_speed_24h: string;
    proof_target: string;
    timestamp: string;
    total_reward: string;
    utxo_count: number;
    tx_count: number;
}

export interface TargetChart {
    height: number;
    interv: string;
    value: number;
}

export interface GuessertChart {
    height: number;
    interv: string;
    value: number;
}

export interface RewardChart {
    height: number;
    interv: string;
    fee: number;
    value: number;
}

export interface UtxoData {
    digest: string;
    id: number;
}

export interface UtxoData {
    digest: string;
    id: number;
}

export interface TransactionData {
    fee: string;
    height: number;
    id: string;
    num_inputs: number;
    num_outputs: number;
    proof_type: string;
    time: string;
    inputs: string[];
    outputs: string[]
}
