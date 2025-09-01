import NavTextLink from "@/components/base/nav-text-link";
import { SearchBlockResponse } from "@/utils/api/types";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { timestampToDate } from "@/utils/tools";
import { Flex, NumberFormatter, Text } from "@mantine/core";
import { IconCube } from "@tabler/icons-react"; 
import styles from "./search.module.css";
import { useRouter } from "next/navigation";
export default function CallbackBlockView({blockResponse}: { blockResponse: SearchBlockResponse }) {
    const router = useRouter();
    return (<Flex direction={"column"} gap={8}>
        <Text style={{ color: "#718096" }}>
            Blocks
        </Text>
        {
            blockResponse && blockResponse.block_hash ?
                <Flex direction={"row"} justify={"space-between"} align={"center"} className={styles.block_result}
                    onClick={() => {
                        router.push(`/block?h=${blockResponse.block_hash}`)
                    }} visibleFrom="sm">
                    <Flex direction={"row"} align={"center"} gap={8}>
                        <IconCube size={18} />
                        <NumberFormatter value={blockResponse.block} thousandSeparator />
                    </Flex>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        {blockResponse.block_hash}
                    </Text>

                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        {timestampToDate(stringConvertToTimestamp(blockResponse.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
                    </Text>
                </Flex> : null
        }
        {
            blockResponse && blockResponse.block_hash ?
                <Flex direction={"column"} gap={8} hiddenFrom="sm">
                    <Flex direction={"row"} justify={"space-between"} align={"center"}>
                        <Flex direction={"row"} align={"center"} gap={8}>
                            <IconCube size={18} />
                            <NavTextLink style={{ fontSize: "18px" }} href={`/block?h=${blockResponse.block}`} >
                                <NumberFormatter value={blockResponse.block} thousandSeparator />
                            </NavTextLink>
                        </Flex>
                    </Flex>
                    <div style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}>
                        <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                            {blockResponse.block_hash}
                        </Text>
                    </div>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        {timestampToDate(stringConvertToTimestamp(blockResponse.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
                    </Text>
                </Flex> :
                <Text>
                    No results found.
                </Text>
        }
    </Flex>)
}