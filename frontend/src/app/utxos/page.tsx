'use client'
import UtxoListTable from "@/components/utxo/table/utxo-list-table";
import { Container, Flex, Space } from "@mantine/core";
import { useEffect } from "react";

export default function Utxos() {
    useEffect(() => {
        document.title = `Utxos - Neptune Explorer`;
    }, [])
    return (<Container fluid p={"lg"}>
        <Flex direction={"column"} gap={16}>
            <UtxoListTable />
        </Flex>
    </Container>)
}