import { SearchPutDataResponse } from "@/utils/api/types"
import { Box, Divider, Flex, NumberFormatter, Text } from "@mantine/core"
import { IconCube, IconTransfer } from "@tabler/icons-react"
import styles from "./search.module.css"
import { ellipsis30 } from "@/utils/ellipsis-format"
import { useRouter } from "next/navigation"
export default function CallbackInoputView({ inputResponse }: { inputResponse: SearchPutDataResponse }) {
    const router = useRouter()
    return (<Flex direction={"column"} gap={8}>
        {
            inputResponse.height ? <Box visibleFrom="sm">
                <Text style={{ color: "#718096" }}>
                    Blocks
                </Text>
                <Flex direction={"row"} justify={"space-between"} align={"center"} className={styles.block_result}
                    onClick={() => {
                        router.push(`/block?h=${inputResponse.height}`)
                    }} visibleFrom="sm">
                    <Flex direction={"row"} align={"center"} gap={8}>
                        <IconCube size={18} />
                        <NumberFormatter value={inputResponse.height} thousandSeparator />
                    </Flex>
                </Flex>
            </Box> : null
        }
        {inputResponse.height && inputResponse.txid ? <Divider visibleFrom="sm" /> : null}
        {
            inputResponse.txid ?
                <Box visibleFrom="sm">
                    <Text style={{ color: "#718096" }}>
                        Transactions
                    </Text>
                    <Flex direction={"row"} justify={"space-between"} align={"center"} className={styles.block_result}
                        onClick={() => {
                            router.push(`/tx?id=${inputResponse.txid}`)
                        }} visibleFrom="sm">
                        <Flex direction={"row"} align={"center"} gap={8}>
                            <IconTransfer size={18} />
                            <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                {inputResponse.txid}
                            </Text>
                        </Flex>
                    </Flex>
                </Box> : null
        }

        {
            inputResponse.height ? <Flex direction={"column"} hiddenFrom="sm" >
                <Text style={{ color: "#718096" }}>
                    Blocks
                </Text>
                <Flex direction={"row"} justify={"space-between"} align={"center"} className={styles.block_result}
                    onClick={() => {
                        router.push(`/block?h=${inputResponse.height}`)
                    }} >
                    <Flex direction={"row"} align={"center"} gap={8}>
                        <IconCube size={18} />
                        <NumberFormatter value={inputResponse.height} thousandSeparator />
                    </Flex>
                </Flex>
            </Flex> : null
        }
        {inputResponse.height && inputResponse.txid ? <Divider hiddenFrom="sm" /> : null}
        {
            inputResponse.txid ?
                <Flex direction={"column"} hiddenFrom="sm" gap={2} onClick={() => {
                    router.push(`/tx?id=${inputResponse.txid}`)
                }}>
                    <Text style={{ color: "#718096" }}>
                        Transactions
                    </Text>
                    <Flex direction={"row"} justify={"space-between"} align={"center"} className={styles.block_result}>
                        <Flex direction={"row"} align={"center"} gap={8}>
                            <IconTransfer size={18} />
                        </Flex>
                    </Flex>
                    <div style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}>
                        <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                            {inputResponse.txid}
                        </Text>
                    </div>
                </Flex> : null
        }
    </Flex>)
}