import { SearchTransactionResponse } from "@/utils/api/types"
import { stringConvertToTimestamp } from "@/utils/data-format"
import { timestampToDate } from "@/utils/tools"
import { Flex, NumberFormatter, Text } from "@mantine/core"
import { IconTransfer } from "@tabler/icons-react" 
import styles from "./search.module.css"
import { ellipsis30 } from "@/utils/ellipsis-format"
import { useRouter } from "next/navigation"
export default function CallbackTransactionView({ transactionResponse }: { transactionResponse: SearchTransactionResponse }) {
    const router = useRouter()
    return (<Flex direction={"column"} gap={8}>
        <Text style={{ color: "#718096" }}>
            Transactions
        </Text>
        <Flex direction={"row"} justify={"space-between"} align={"center"} className={styles.block_result}
            onClick={() => {
                router.push(`/tx?id=${transactionResponse.id}`)
            }} visibleFrom="sm">
            <Flex direction={"row"} align={"center"} gap={8}>
                <IconTransfer size={18} />
                {
                    transactionResponse.height ? <NumberFormatter value={transactionResponse.height ?? "--"} thousandSeparator /> : "--"
                }
            </Flex>
            <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                {ellipsis30(transactionResponse.id)}
            </Text>

            <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                {timestampToDate(stringConvertToTimestamp(transactionResponse.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
            </Text>
        </Flex>
        <Flex direction={"column"} gap={8} hiddenFrom="sm" onClick={() => {
            router.push(`/tx?id=${transactionResponse.id}`)
        }}>
            <Flex direction={"row"} justify={"space-between"} align={"center"}>
                <Flex direction={"row"} align={"center"} gap={8}>
                    <IconTransfer size={18} />
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        {
                            transactionResponse.height ?
                                <NumberFormatter value={transactionResponse.height ?? "--"} thousandSeparator /> : "--"
                        }
                    </Text>
                </Flex>
            </Flex>
            <div style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
            }}>
                <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                    {ellipsis30(transactionResponse.id)}
                </Text>
            </div>
            <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                {timestampToDate(stringConvertToTimestamp(transactionResponse.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
            </Text>
        </Flex>
    </Flex>)
}