import { SearchPutDataResponse } from "@/utils/api/types"
import { Box, Divider, Flex, NumberFormatter, Text } from "@mantine/core"
import { IconCube, IconTransfer } from "@tabler/icons-react"
import styles from "./search.module.css"
import { ellipsis30 } from "@/utils/ellipsis-format"
import { useRouter } from "next/navigation"
export default function CallbackOutputView({ outputResponse }: { outputResponse: SearchPutDataResponse }) {
    const router = useRouter()
    return (<Flex direction={"column"} gap={8}>
        {
            outputResponse.height ? <Box visibleFrom="sm">
                <Text style={{ color: "#718096" }}>
                    Blocks
                </Text>
                <Flex direction={"row"} justify={"space-between"} align={"center"} className={styles.block_result}
                    onClick={() => {
                        router.push(`/block?h=${outputResponse.height}`)
                    }} visibleFrom="sm">
                    <Flex direction={"row"} align={"center"} gap={8}>
                        <IconCube size={18} />
                        <NumberFormatter value={outputResponse.height} thousandSeparator />
                    </Flex>
                </Flex>
            </Box> : null
        }
        {outputResponse.height && outputResponse.txid ? <Divider visibleFrom="sm" /> : null}
        {
            outputResponse.txid ?
                <Box visibleFrom="sm">
                    <Text style={{ color: "#718096" }}>
                        Transactions
                    </Text>
                    <Flex direction={"row"} justify={"space-between"} align={"center"} className={styles.block_result}
                        onClick={() => {
                            router.push(`/tx?id=${outputResponse.txid}`)
                        }} visibleFrom="sm">
                        <Flex direction={"row"} align={"center"} gap={8}>
                            <IconTransfer size={18} />
                            <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                {outputResponse.txid}
                            </Text>
                        </Flex>
                    </Flex>
                </Box> : null
        }

        {
            outputResponse.height ? <Flex direction={"column"} hiddenFrom="sm" >
                <Text style={{ color: "#718096" }}>
                    Blocks
                </Text>
                <Flex direction={"row"} justify={"space-between"} align={"center"} className={styles.block_result}
                    onClick={() => {
                        router.push(`/block?h=${outputResponse.height}`)
                    }} >
                    <Flex direction={"row"} align={"center"} gap={8}>
                        <IconCube size={18} />
                        <NumberFormatter value={outputResponse.height} thousandSeparator />
                    </Flex>
                </Flex>
            </Flex> : null
        }
        {outputResponse.height && outputResponse.txid ? <Divider hiddenFrom="sm" /> : null}
        {
            outputResponse.txid ?
                <Flex direction={"column"} hiddenFrom="sm" gap={2} onClick={() => {
                    router.push(`/tx?id=${outputResponse.txid}`)
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
                            {outputResponse.txid}
                        </Text>
                    </div>
                </Flex> : null
        }
    </Flex>)
}