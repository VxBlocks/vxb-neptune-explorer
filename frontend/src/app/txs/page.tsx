'use client'
import TransactionListTable from "@/components/utxo/table/transaction-list-table";
import { Container, Flex } from "@mantine/core";
import { useEffect } from "react";

export default function Ttansactions() {
    useEffect(() => {
        document.title = `Ttansactions - Neptune Explorer`;
    }, [])
    return (<Container fluid p={"lg"}>
        <Flex direction={"column"} gap={16}>
            <TransactionListTable />
        </Flex>
    </Container>)
}