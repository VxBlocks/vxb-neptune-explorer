'use client'
import ForkListTable from "@/components/block/table/forks-list-table";
import { Container, Flex } from "@mantine/core";
import { useEffect } from "react";
export default function Forks() {
    useEffect(() => {
        document.title = `Forks - Neptune Explorer`;
    }, [])
    return (<Container fluid p={"lg"}>
        <Flex direction={"column"} gap={16}>
            <ForkListTable />
        </Flex>
    </Container>)
}