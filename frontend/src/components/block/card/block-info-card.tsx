import { TimeClock } from "@/components/TimeClock";
import { useBlockInfo, useLoadingBlockInfo, useRpcBlockData } from "@/store/block/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { ellipsis } from "@/utils/ellipsis-format";
import { numberConverTo, tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { Box, Card, Flex, Group, LoadingOverlay, NumberFormatter, Text } from "@mantine/core";

export default function BlockInfoCard() {
    const loading = useLoadingBlockInfo()
    const blockInfo = useBlockInfo()
    const rpcBlock = useRpcBlockData()
    return (<Box pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                    <Text fw={500}>{`Block #${numberConverTo(blockInfo?.block)}`}</Text>
                    <TimeClock style={{ fontSize: "12px", color: "#1D8282" }} timeStamp={stringConvertToTimestamp(blockInfo?.time ?? "")}></TimeClock>
                </Group>
            </Card.Section>
            <Flex direction={"column"} gap={"md"} style={{ marginTop: "16px" }}>
                <Flex direction={"row"} gap={"md"} align={"center"}>
                    <Text>
                        Block Hash:
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }} visibleFrom="sm">
                        {blockInfo?.block_hash}
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }} hiddenFrom="sm">
                        {ellipsis(blockInfo?.block_hash)}
                    </Text>
                </Flex>
                <Flex direction={"row"} gap={"md"} align={"center"}>
                    <Text>
                        Create Time:
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }} visibleFrom="sm">
                        {timestampToDate(stringConvertToTimestamp(blockInfo?.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }} hiddenFrom="sm">
                        {ellipsis(blockInfo?.block_hash)}
                    </Text>
                </Flex>
                <Flex direction={"row"} gap={"md"} align={"center"}>
                    <Text>
                        Difficulty:
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        <NumberFormatter value={blockInfo?.target} thousandSeparator />
                    </Text>
                </Flex>
                <Flex direction={"row"} gap={"md"} align={"center"}>
                    <Text>
                        Inputs:
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        <NumberFormatter value={rpcBlock?.num_inputs} thousandSeparator />
                    </Text>
                </Flex>
                <Flex direction={"row"} gap={"md"} align={"center"}>
                    <Text>
                        Outputs:
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        <NumberFormatter value={rpcBlock?.num_outputs} thousandSeparator />
                    </Text>
                </Flex>
                <Flex direction={"row"} gap={"md"} align={"center"}>
                    <Text>
                        Coinbase Reward:
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        {numberConverTo(tokenFormat(blockInfo?.block_coinbase_reward))}
                    </Text>
                </Flex>

                <Flex direction={"row"} gap={"md"} align={"center"}>
                    <Text>
                        Miner Reward:
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        <NumberFormatter value={tokenFormat(blockInfo?.block_gas)} thousandSeparator />
                    </Text>
                </Flex>
                <Flex direction={"row"} gap={"md"} align={"center"}>
                    <Text>
                        Nonce:
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        {
                            rpcBlock?.nonce
                        }
                    </Text>
                </Flex>
                <Flex direction={"row"} gap={"md"} align={"center"}>
                    <Text>
                        Canonical:
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                        {blockInfo?.is_canonical ? "Yes. This block is in the canonical blockchain." : ""}
                    </Text>
                </Flex>
            </Flex>
        </Card>
    </Box>)
}