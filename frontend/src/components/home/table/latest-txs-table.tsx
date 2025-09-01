import NavTextLink from "@/components/base/nav-text-link";
import { useLatestTxDatas } from "@/store/txs/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { ellipsis } from "@/utils/ellipsis-format";
import { tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { Table, NumberFormatter, Center, Flex, Text, Card, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function LatestTxsTable() {
    const latestTxDatas = useLatestTxDatas();
    const router = useRouter();
    const rows = latestTxDatas && latestTxDatas.map((element) => (
        <Table.Tr key={element.id}>
            <Table.Td>
                {
                    element.height ? <NavTextLink href={`/block?h=${element.height}`}>
                        <NumberFormatter value={element.height} thousandSeparator />
                    </NavTextLink> : "--"
                }

            </Table.Td>
            <Table.Td style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
            }}>
                <NavTextLink href={`/tx?id=${element.id}`}>
                    {ellipsis(element?.id)}
                </NavTextLink>
            </Table.Td>
            <Table.Td>
                <NumberFormatter value={tokenFormat(element.fee)} thousandSeparator />
            </Table.Td>
            <Table.Td>
                <Center>
                    <NumberFormatter value={element?.num_inputs} thousandSeparator />
                </Center>
            </Table.Td>
            <Table.Td>
                <Center>
                    <NumberFormatter value={element?.num_outputs} thousandSeparator />
                </Center>
            </Table.Td>
            <Table.Td>
                {element?.proof_type}
            </Table.Td>
            <Table.Td>
                {element?.time && element?.time === "0001-01-01T08:05:43+08:05" ? "--" : timestampToDate(stringConvertToTimestamp(element?.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
            </Table.Td>
        </Table.Tr>
    ));
    const ths = (
        <Table.Tr>
            <Table.Th>Block</Table.Th>
            <Table.Th>ID</Table.Th>
            <Table.Th>Fee</Table.Th>
            <Table.Th>
                <Center>
                    Inputs
                </Center>
            </Table.Th>
            <Table.Th>
                <Center>
                    Outputs
                </Center>
            </Table.Th>
            <Table.Th>
                Type
            </Table.Th>
            <Table.Th>Time</Table.Th>
        </Table.Tr>
    );
    return (
        <Flex direction={"column"} gap={"sm"}>
            <Card withBorder radius={8} p={"8px"} visibleFrom="sm">
                <Table striped withRowBorders={false} horizontalSpacing="lg" verticalSpacing="23" >
                    <Table.Thead>{ths}</Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Card>
            <Flex direction={"column"} gap={"sm"} hiddenFrom="sm">
                {
                    latestTxDatas && latestTxDatas.map((item, index) => {
                        return (<Card key={index} withBorder radius={8} p={"10px"}>
                            <Flex direction={"column"} gap={"md"} style={{ marginTop: "16px" }}>
                                <Flex direction={"row"} gap={"md"} align={"center"}>
                                    <Text w={"120px"}>
                                        Block:
                                    </Text>
                                    <div style={{
                                        width: "100%",
                                        minWidth: "120px"
                                    }}>
                                        {
                                            item.height ? <NavTextLink href={`/block?h=${item.height}`}>
                                                <NumberFormatter value={item.height} thousandSeparator />
                                            </NavTextLink> : "--"
                                        }
                                    </div>
                                </Flex>
                                <Flex direction={"row"} gap={"md"} align={"top"}
                                    style={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}>
                                    <Text w={"120px"}>
                                        ID:
                                    </Text>
                                    <div style={{
                                        width: "100%",
                                        minWidth: "120px",
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}>
                                        <NavTextLink href={`/tx?id=${item.id}`}>
                                            <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                {item?.id}
                                            </Text>
                                        </NavTextLink>

                                    </div>
                                </Flex>
                                <Flex direction={"row"} gap={"md"} align={"top"}>
                                    <Text w={"120px"}>
                                        Fee:
                                    </Text>
                                    <div style={{
                                        width: "100%",
                                        minWidth: "120px"
                                    }}>
                                        <NumberFormatter value={tokenFormat(item.fee)} thousandSeparator />
                                    </div>

                                </Flex>
                                <Flex direction={"row"} gap={"md"} align={"top"}>
                                    <Text w={"120px"}>
                                        Inputs:
                                    </Text>
                                    <div style={{
                                        width: "100%",
                                        minWidth: "120px"
                                    }}>
                                        <NumberFormatter value={item?.num_inputs} thousandSeparator />
                                    </div>

                                </Flex>
                                <Flex direction={"row"} gap={"md"} align={"top"}>
                                    <Text w={"120px"}>
                                        Outputs:
                                    </Text>
                                    <div style={{
                                        width: "100%",
                                        minWidth: "120px"
                                    }}>
                                        <NumberFormatter value={item?.num_outputs} thousandSeparator />
                                    </div>
                                </Flex>
                                <Flex direction={"row"} gap={"md"} align={"top"}>
                                    <Text w={"120px"}>
                                        Proof Type:
                                    </Text>
                                    <div style={{
                                        width: "100%",
                                        minWidth: "120px"
                                    }}>
                                        {item?.proof_type}
                                    </div>
                                </Flex>
                                <Flex direction={"row"} gap={"md"} align={"top"}>
                                    <Text w={"120px"}>
                                        Time:
                                    </Text>
                                    <div style={{
                                        width: "100%",
                                        minWidth: "120px"
                                    }}>
                                        {item?.time && item?.time === "0001-01-01T08:05:43+08:05" ? "--" : timestampToDate(stringConvertToTimestamp(item?.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
                                    </div>

                                </Flex>
                            </Flex>
                        </Card>)
                    })
                }
            </Flex>
            {
                latestTxDatas && latestTxDatas.length === 5 &&
                <Flex justify={"center"}>
                    <UnstyledButton component="a"
                        onClick={() => {
                            router.push("/txs")
                        }}>
                        View all Txs
                    </UnstyledButton>
                </Flex>
            }
        </Flex>
    )
}