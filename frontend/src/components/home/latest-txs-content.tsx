'use client'
import { Box, Card, Flex, LoadingOverlay } from "@mantine/core";
import TitleText from "../base/title-text";
import { useLoadingLatestTxs } from "@/store/txs/hooks";
import LatestTxsTable from "./table/latest-txs-table";

export default function LatestTxsContent() {
    const loading = useLoadingLatestTxs()
    return (
        <Flex direction={"column"} gap={8}>
            <TitleText>
                Latest Transactions
            </TitleText>
            <Box pos="relative">
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> 
                <LatestTxsTable /> 
            </Box>
        </Flex>)
}