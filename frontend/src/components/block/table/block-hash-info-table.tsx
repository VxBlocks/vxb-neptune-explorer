import NavTextLink from "@/components/base/nav-text-link";
import { TimeClock } from "@/components/TimeClock";
import { useLoadingBlockInfo, useRpcBlockData } from "@/store/block/hooks";
import { useAppDispatch } from "@/store/hooks";
import { requestTransactionByHeight } from "@/store/txs/txs-slice";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { numberConverTo, tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { Box, Card, Flex, Group, LoadingOverlay, NumberFormatter, Table, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlockHashInfoTable({ hash }: { hash: string }) {
    const loading = useLoadingBlockInfo()
    const disapth = useAppDispatch()
    const rpcBlock = useRpcBlockData()
    const router = useRouter()
    const [blocks, setBlocks] = useState({
        nextBlock: 0,
        previousBlock: 0
    })
    useEffect(() => {
        if (rpcBlock) {
            if (rpcBlock.height >= 0) {
                setBlocks({
                    nextBlock: rpcBlock.height + 1,
                    previousBlock: rpcBlock.height - 1
                })
            }
            disapth(requestTransactionByHeight({
                height: rpcBlock?.height
            }))
        }

    }, [rpcBlock])

    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                    <Flex direction="row" gap={16} align={"center"}>
                        <Text fw={500}>{`Block #${numberConverTo(rpcBlock?.height)}`}</Text>
                        <Flex direction={"row"} gap={24}>
                            <NavTextLink
                                style={{ fontSize: "12px" }}
                                disable={(rpcBlock?.height == 0)}
                                href={`/block?h=${blocks.previousBlock}`} >
                                {"< Previous"}
                            </NavTextLink>
                            <NavTextLink
                                style={{ fontSize: "12px" }}
                                href={`/block?h=${blocks.nextBlock}`}  >
                                {"Next >"}
                            </NavTextLink>
                        </Flex>
                    </Flex>
                    <TimeClock style={{ fontSize: "12px", color: "#1D8282" }} timeStamp={stringConvertToTimestamp(rpcBlock?.time ?? "")}></TimeClock>
                </Group>
            </Card.Section>
            <Group mt="xs">
                <Box pos="relative">
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <Table variant="vertical" layout="fixed" withRowBorders={false} striped={false} styles={{
                        th: {
                            background: "transparent",
                        }
                    }}>
                        <Table.Tbody style={{
                            verticalAlign: "top",
                        }}>
                            <Table.Tr>
                                <Table.Th w={150}>Block Hash:</Table.Th>
                                <Table.Td style={{
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                }}>
                                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                        {rpcBlock?.digest}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th w={150}>Previous Hash:</Table.Th>
                                <Table.Td style={{
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                }}>
                                    <Text style={{ fontSize: "14px", color: "#1D8282", cursor: "pointer" }} onClick={() => {
                                        router.push(`/block?h=${rpcBlock?.prev_block_digest}`)
                                    }}>
                                        {rpcBlock?.prev_block_digest}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>

                            <Table.Tr>
                                <Table.Th>Nonce:</Table.Th>
                                <Table.Td style={{
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                }}>
                                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                        {rpcBlock?.nonce}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>

                            <Table.Tr>
                                <Table.Th>Create Time:</Table.Th>
                                <Table.Td>
                                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                        {timestampToDate(stringConvertToTimestamp(rpcBlock?.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>

                            <Table.Tr>
                                <Table.Th>Difficulty:</Table.Th>
                                <Table.Td>
                                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                        <NumberFormatter value={rpcBlock?.difficulty} thousandSeparator />
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                            {
                                rpcBlock?.num_inputs ? <Table.Tr>
                                    <Table.Th w={100}>{`Inputs (${rpcBlock?.num_inputs}):`}</Table.Th>
                                    <Table.Td style={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}>
                                        <Flex direction={"column"} gap={8}>
                                            {
                                                rpcBlock?.inputs?.map((input, index) => {
                                                    return (
                                                        <Text key={index} style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                            {input}
                                                        </Text>
                                                    )
                                                })
                                            }
                                        </Flex>
                                    </Table.Td>
                                </Table.Tr> : null
                            } 
                            {
                                rpcBlock?.num_outputs ? <Table.Tr>
                                    <Table.Th w={100}>{`Outputs (${rpcBlock?.num_outputs}):`}</Table.Th>
                                    <Table.Td style={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}>
                                        <Flex direction={"column"} gap={8}>
                                            {
                                                rpcBlock?.outputs?.map((output, index) => {
                                                    return (
                                                        <Text key={index} style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                            {output}
                                                        </Text>
                                                    )
                                                })
                                            }
                                        </Flex>
                                    </Table.Td>
                                </Table.Tr> : null
                            }
                            <Table.Tr>
                                <Table.Th>Announcements:</Table.Th>
                                <Table.Td>
                                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                        {numberConverTo(rpcBlock?.num_public_announcements)}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Coinbase Reward:</Table.Th>
                                <Table.Td>
                                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                        {numberConverTo(tokenFormat(rpcBlock?.coinbase_amount))}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>

                            <Table.Tr>
                                <Table.Th>Miner Reward:</Table.Th>
                                <Table.Td>
                                    <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                        {numberConverTo(tokenFormat(rpcBlock?.fee))}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Canonical:</Table.Th>
                                <Table.Td>
                                    <Text style={{ fontSize: "14px", color: "#8E8E93", fontWeight: "400" }}>
                                        {rpcBlock?.is_canonical ? "Yes. This block is in the canonical blockchain." : "No. This block is not in the canonical blockchain."}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                            {
                                rpcBlock?.sibling_blocks && rpcBlock?.sibling_blocks.length > 0 &&
                                <Table.Tr>
                                    <Table.Th>Sibling Blocks:</Table.Th>
                                    <Table.Td style={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}>
                                        <Flex direction={"column"}>
                                            {
                                                rpcBlock?.sibling_blocks.map((item, index) => {
                                                    return (<Text key={index} style={{ fontSize: "14px", color: "#1D8282", cursor: "pointer" }}
                                                        onClick={() => {
                                                            router.push(`/block?h=${item}`)
                                                        }}>
                                                        {item}
                                                    </Text>)
                                                })
                                            }
                                        </Flex>

                                    </Table.Td>
                                </Table.Tr>
                            }

                        </Table.Tbody>
                    </Table>
                </Box>
            </Group>
        </Card>)

}