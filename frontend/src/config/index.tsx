export const LOCALE_COOKIE_NAME = 'locale'

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neptune.vxb.ai'

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://neptune.vxb.ai/api/block/ws'

export const SWAGGER_URL = process.env.NEXT_PUBLIC_SWAGGER_URL || 'https://neptune.vxb.ai/api/swagger.json'


export const NEPTUNE_TOKEMOCIS_NOTISTICE = `
Neptune's tokenomics share similarities with Bitcoin but have key distinctions:
- **Supply Model**: Hard cap of 42 million tokens. New tokens minted per block (initial reward: 128 tokens), halving every 3 years.
- **Timing**: 9.8-minute block time, 3-year cycles (~158k blocks).
- **Initial Supply**: 831,600 pre-minted tokens (1.98% of total cap).
- **Scarcity**: Stock-to-Flow (S2F) ratio to surpass Bitcoin's by 2068.
- **Key Advantage**: No tail emission, ensuring absolute supply scarcity for long-term value storage. 
<a href="https://neptune.cash/blog/tokenomics/" target="_blank">Detailed Information</a>

`

