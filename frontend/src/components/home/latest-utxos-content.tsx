'use client'
import { Box, Flex, LoadingOverlay } from "@mantine/core";
import TitleText from "../base/title-text";
import LatestUtxosTable from "./table/latest-utxos-table";
import { useLoadingLatestUtxo } from "@/store/utxo/hooks";

export default function LatestUtxosContent() {
    const loading = useLoadingLatestUtxo()
    return (
        <Flex direction={"column"} gap={8}>
            <TitleText>
                Latest UTXOs
            </TitleText>
            <Box pos="relative">
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <LatestUtxosTable />
            </Box>
        </Flex>)
}