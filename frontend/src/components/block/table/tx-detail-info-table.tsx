import NavTextLink from "@/components/base/nav-text-link"
import { useLoadingTxDetail, useTxDetail } from "@/store/txs/hooks"
import { stringConvertToTimestamp } from "@/utils/data-format"
import { numberConverTo, tokenFormat } from "@/utils/math-format"
import { timestampToDate } from "@/utils/tools"
import { Box, Card, Flex, Group, LoadingOverlay, NumberFormatter, Table, Text } from "@mantine/core"
import { useRouter } from "next/navigation"

export default function TxDetailInfoTable() {
    const loading = useLoadingTxDetail()
    const txDetail = useTxDetail()
    const router = useRouter()
    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                    <Flex direction="row" gap={16} align={"center"}>
                        <Text fw={500}>{`Transaction Detail`}</Text>
                    </Flex>
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
                        {
                            txDetail && <Table.Tbody style={{
                                verticalAlign: "top",
                            }}>
                                <Table.Tr>
                                    <Table.Th w={100}>ID:</Table.Th>
                                    <Table.Td style={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}>
                                        <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                            {txDetail.id}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th w={100}>Block:</Table.Th>
                                    <Table.Td>
                                        {
                                            txDetail.height ?
                                                <NavTextLink
                                                    href={`/block?h=${txDetail.height}`}  >
                                                    <NumberFormatter value={txDetail.height} thousandSeparator />
                                                </NavTextLink> : "--"
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th w={100}>Inputs:</Table.Th>
                                    <Table.Td style={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}>
                                        <Flex direction={"column"} gap={8}>
                                            {
                                                txDetail?.inputs?.map((input, index) => {
                                                    return (
                                                        <Text key={index} style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                            {input}
                                                        </Text>
                                                    )
                                                })
                                            }
                                        </Flex>
                                    </Table.Td>
                                </Table.Tr>

                                <Table.Tr>
                                    <Table.Th w={100}>Outputs:</Table.Th>
                                    <Table.Td style={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}>
                                        <Flex direction={"column"} gap={8}>
                                            {
                                                txDetail?.outputs?.map((output, index) => {
                                                    return (
                                                        <Text key={index} style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                            {output}
                                                        </Text>
                                                    )
                                                })
                                            }
                                        </Flex>
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th w={100}>Fee:</Table.Th>
                                    <Table.Td>
                                        <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                            <NumberFormatter value={tokenFormat(txDetail?.fee)} thousandSeparator />
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>


                                <Table.Tr>
                                    <Table.Th w={100}>Time:</Table.Th>
                                    <Table.Td>
                                        <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                            {timestampToDate(stringConvertToTimestamp(txDetail?.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th w={100}>Proof Type:</Table.Th>
                                    <Table.Td>
                                        <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                            {txDetail?.proof_type}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>

                            </Table.Tbody>
                        }
                    </Table>
                </Box>
            </Group>
        </Card>
    )
}