'use client'
import BlockListTable from "@/components/block/table/block-list-table";
import { Container, Flex } from "@mantine/core";
import { useEffect } from "react";
export default function Blocks() {
    useEffect(() => {
        document.title = `Blocks - Neptune Explorer`;
    }, [])
    return (<Container fluid p={"lg"}>
        <Flex direction={"column"} gap={16}>
            <BlockListTable />
        </Flex>
    </Container>)
}