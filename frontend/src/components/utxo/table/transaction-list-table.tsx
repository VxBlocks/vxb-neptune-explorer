import NavTextLink from "@/components/base/nav-text-link";
import TitleText from "@/components/base/title-text";
import PaginationContent from "@/components/pagination-content";
import { useAppDispatch } from "@/store/hooks";
import { useLoadingAllTxs, useTransactionDatas, useTransactionPage, useTransactionTotal } from "@/store/txs/hooks";
import { requestAllTxs, setTxPage } from "@/store/txs/txs-slice";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { Box, Card, Center, Flex, LoadingOverlay, NumberFormatter, Table, Text } from "@mantine/core";
import { useEffect } from "react";

export default function TransactionListTable() {
    const dispatch = useAppDispatch();
    const txsPage = useTransactionPage()
    const total = useTransactionTotal()
    useEffect(() => {
        dispatch(requestAllTxs({
            page: txsPage
        }))
    }, [txsPage]);
    const loading = useLoadingAllTxs()
    const txsDatas = useTransactionDatas();
    const rows = txsDatas && txsDatas.map((element) => (
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
                    {element?.id}
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
                Proof Type
            </Table.Th>
            <Table.Th>Time</Table.Th>
        </Table.Tr>
    );
    return (
        <Flex direction={"column"}>
            <Flex direction={"row"} justify={"space-between"} align={"center"}>
                <TitleText>
                    Transactions
                </TitleText>
                <PaginationContent
                    total={total}
                    currentPage={txsPage}
                    onchange={function (value: number): void {
                        dispatch(setTxPage(value))
                    }} />

            </Flex>
            <Box pos="relative">
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Table striped withRowBorders={false} horizontalSpacing="lg" verticalSpacing="lg" visibleFrom="sm">
                    <Table.Thead>{ths}</Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
                <Flex direction={"column"} gap={"sm"} hiddenFrom="sm">
                    {
                        txsDatas && txsDatas.map((item, index) => {
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
            </Box>
        </Flex>
    )
}