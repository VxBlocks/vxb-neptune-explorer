'use client'

import BlockListCard from "@/components/block/card/block-list-card";
import TxDetailInfoTable from "@/components/block/table/tx-detail-info-table";
import { useAppDispatch } from "@/store/hooks";
import { useTxDetail } from "@/store/txs/hooks";
import { requestTransactionDetail } from "@/store/txs/txs-slice";
import { ellipsis5 } from "@/utils/ellipsis-format";
import { Container, Flex } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function TxDetailPage() {
    const searchParams = useSearchParams();
    const txid = searchParams.get('id')
    const dispatch = useAppDispatch()
    const txDetail = useTxDetail()
    useEffect(() => {
        if (txid) {
            dispatch(requestTransactionDetail({ txid }))
        }
    }, [txid])
    useEffect(() => {
        if (txDetail) {
            document.title = `Ttansaction ${ellipsis5(txDetail.id)} - Neptune Explorer`;
        }
    }, [txDetail])
    return (
        <Container fluid p={"lg"}>
            <Flex direction={"column"} gap={16}>
                <BlockListCard />
                <TxDetailInfoTable />
            </Flex>
        </Container>)
}