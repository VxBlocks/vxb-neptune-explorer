import TitleText from "@/components/base/title-text";
import PaginationContent from "@/components/pagination-content";
import { useAppDispatch } from "@/store/hooks";
import { useLoadingUtxo, useUtxoDatas, useUtxoPage, useUtxoTotalPage } from "@/store/utxo/hooks";
import { requestAllUtxos, setUtxoPage } from "@/store/utxo/utxo-slice";
import { Box, Card, Center, Flex, LoadingOverlay, NumberFormatter, Table, Text } from "@mantine/core";
import { useEffect } from "react";

export default function UtxoListTable() {
    const dispatch = useAppDispatch();
    const utxoPage = useUtxoPage()
    const totalPages = useUtxoTotalPage()
    useEffect(() => {
        dispatch(requestAllUtxos({
            page: utxoPage
        }))
    }, [utxoPage]);
    const loading = useLoadingUtxo()
    const utxoDatas = useUtxoDatas();
    const rows = utxoDatas && utxoDatas.map((element) => (
        <Table.Tr key={element.id}>
            <Table.Td>
                <NumberFormatter value={element.id} thousandSeparator />
                {/* <NavLink label={<NumberFormatter value={element.block} thousandSeparator />} href={`/block?h=${element.block}`} /> */}
            </Table.Td>
            <Table.Td>
                <Center>
                    {element?.digest}
                </Center>
            </Table.Td>
        </Table.Tr>
    ));
    const ths = (
        <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th><Center> Digest</Center></Table.Th>
        </Table.Tr>
    );
    return (
        <Flex direction={"column"}>
            <Flex direction={"row"} justify={"space-between"} align={"center"}>
                <TitleText>
                    Utxos
                </TitleText>
                <PaginationContent
                    total={totalPages}
                    currentPage={utxoPage}
                    onchange={function (value: number): void {
                        dispatch(setUtxoPage(value))
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
                        utxoDatas && utxoDatas.map((item, index) => {
                            return (<Card key={index} withBorder radius={8} p={"10px"}>
                                <Flex direction={"column"} gap={"md"} style={{ marginTop: "16px" }}>
                                    <Flex direction={"row"} gap={"md"} align={"center"}>
                                        <Text w={"80px"}>
                                            ID:
                                        </Text>
                                        <div style={{
                                            width: "100%",
                                            minWidth: "140px"
                                        }}>
                                            <Text style={{ fontSize: "14px", color: "#332526" }}>
                                                <NumberFormatter value={item.id} thousandSeparator />
                                            </Text>
                                        </div>

                                    </Flex>
                                    <Flex direction={"row"}
                                        gap={"md"} align={"top"}
                                        style={{
                                            wordWrap: "break-word",
                                            overflowWrap: "break-word",
                                        }}>
                                        <Text w={"80px"}>
                                            Digest:
                                        </Text>
                                        <div style={{
                                            width: "100%",
                                            minWidth: "140px",
                                            wordWrap: "break-word",
                                            overflowWrap: "break-word",
                                        }}>
                                            <Text style={{ fontSize: "14px", color: "#332526" }}>
                                                {item.digest}
                                            </Text>
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