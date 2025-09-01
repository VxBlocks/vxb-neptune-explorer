import { Box, Flex, LoadingOverlay } from "@mantine/core";
import TitleText from "../base/title-text";
import LatestBlocksTable from "./table/latest-blocks-table";
import { useLoadingLeastBlocks } from "@/store/block/hooks";

export default function LastestBlocksContent() {
    const loading = useLoadingLeastBlocks()
    return (<Flex direction={"column"} gap={8}>
        <TitleText>
            Latest Blocks
        </TitleText>
        <Box pos="relative">
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> 
            <LatestBlocksTable />
        </Box>
    </Flex>)
}