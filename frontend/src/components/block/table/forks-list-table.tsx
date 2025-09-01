import NavTextLink from "@/components/base/nav-text-link";
import TitleText from "@/components/base/title-text";
import PaginationContent from "@/components/pagination-content";
import { requestForkListData, setForksPage } from "@/store/block/block-slice";
import { useForks, useForksPage, useForksTotalPage, useLoadingForks } from "@/store/block/hooks";
import { useAppDispatch } from "@/store/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { Box, Card, Flex, LoadingOverlay, NumberFormatter, Table, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ForkListTable() {
    const dispatch = useAppDispatch();
    const forkPage = useForksPage()
    const totalPages = useForksTotalPage()
    const router = useRouter();
    useEffect(() => {
        dispatch(requestForkListData({ page: forkPage }))
    }, [forkPage]);
    const loading = useLoadingForks()
    const forks = useForks();
    const rows = forks && forks.map((element) => (
        <Table.Tr key={element.block}>
            <Table.Td>
                <NumberFormatter value={element.block} thousandSeparator />
            </Table.Td>
            <Table.Td style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
            }}>
                <NavTextLink href={`/block?h=${element.block_hash}`}>
                    {element?.block_hash}
                </NavTextLink>
            </Table.Td>
            <Table.Td>{
                <NumberFormatter value={element.proof_target} thousandSeparator />}
            </Table.Td>
            <Table.Td>
                <Flex direction={"row"} align={"center"}>
                    <NumberFormatter value={tokenFormat(element.coinbase_reward)} thousandSeparator />
                    <Text> / </Text>
                    <NumberFormatter value={tokenFormat(element.fee)} thousandSeparator />
                </Flex>

            </Table.Td>
            <Table.Td>
                <NumberFormatter value={element.outputs} thousandSeparator />
            </Table.Td>
            <Table.Td>
                {timestampToDate(stringConvertToTimestamp(element?.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
            </Table.Td>
        </Table.Tr>
    ));
    const ths = (
        <Table.Tr>
            <Table.Th>Block</Table.Th>
            <Table.Th>Hash</Table.Th>
            <Table.Th>Difficulty</Table.Th>
            <Table.Th>Reward</Table.Th>
            <Table.Th>Outputs</Table.Th>
            <Table.Th>Time</Table.Th>
        </Table.Tr>
    );
    return (
        <Flex direction={"column"}>
            <Flex direction={"row"} justify={"space-between"} align={"center"}>
                <TitleText>
                    Forks
                </TitleText>
                <PaginationContent
                    total={totalPages}
                    currentPage={forkPage}
                    onchange={function (value: number): void {
                        dispatch(setForksPage(value))
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
                        forks && forks.map((item, index) => {
                            return (<Card key={index} withBorder radius={8} p={"10px"}>
                                <Flex direction={"column"} gap={"md"} style={{ marginTop: "16px" }}>
                                    <Flex direction={"row"} gap={"md"} align={"center"}>
                                        <Text w={120}>
                                            Block:
                                        </Text>
                                        <div style={{
                                            width: "100%",
                                            minWidth: "120px"
                                        }}>
                                            <NumberFormatter value={item.block} />
                                        </div>

                                    </Flex>
                                    <Flex direction={"row"} gap={"md"} align={"top"}>
                                        <Text w={120}>
                                            Hash:
                                        </Text>
                                        <div style={{
                                            width: "100%",
                                            minWidth: "120px",
                                            wordWrap: "break-word",
                                            overflowWrap: "break-word",
                                        }}>
                                            <Text style={{ fontSize: "14px", color: "#8E8E93", cursor: "pointer" }}
                                                onClick={() => {
                                                    router.push(`/block?h=${item.block_hash}`)
                                                }}>
                                                {item?.block_hash}
                                            </Text>
                                        </div>
                                    </Flex>
                                    <Flex direction={"row"} gap={"md"} align={"center"}>
                                        <Text w={120}>
                                            Difficulty:
                                        </Text>
                                        <div style={{
                                            width: "100%",
                                            minWidth: "120px"
                                        }}>
                                            <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                {item?.proof_target}
                                            </Text>
                                        </div>
                                    </Flex>
                                    <Flex direction={"row"} gap={"md"} align={"center"}>
                                        <Text w={120}>
                                            Reward:
                                        </Text>
                                        <div style={{
                                            width: "100%",
                                            minWidth: "120px"
                                        }}>
                                            <Flex direction={"row"} align={"center"}>
                                                <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                    <NumberFormatter value={tokenFormat(item?.coinbase_reward)} thousandSeparator />
                                                </Text>
                                                <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                    <Text> / </Text>
                                                </Text>
                                                <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                    <NumberFormatter value={tokenFormat(item?.fee)} thousandSeparator />
                                                </Text>
                                            </Flex>
                                        </div>
                                    </Flex>

                                    <Flex direction={"row"} gap={"md"} align={"center"}>
                                        <Text w={120}>
                                            Outputs:
                                        </Text>
                                        <div style={{
                                            width: "100%",
                                            minWidth: "120px",
                                            wordWrap: "break-word",
                                            overflowWrap: "break-word",
                                        }}>
                                            <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                {item.outputs}
                                            </Text>
                                        </div>

                                    </Flex>
                                    <Flex direction={"row"} gap={"md"} align={"center"}>
                                        <Text w={120}>
                                            Time:
                                        </Text>
                                        <div style={{
                                            width: "100%",
                                            minWidth: "120px",
                                            wordWrap: "break-word",
                                            overflowWrap: "break-word",
                                        }}>
                                            <Text style={{ fontSize: "14px", color: "#8E8E93" }}>
                                                {timestampToDate(stringConvertToTimestamp(item?.time ?? ""), "YYYY-MM-DD HH:mm:ss")}
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