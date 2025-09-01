'use client'
import BlockListCard from "@/components/block/card/block-list-card";
import BlockHashInfoTable from "@/components/block/table/block-hash-info-table";
import BlockTransactionTable from "@/components/block/table/block-transaction-table";
import { requestBlockInfoByHash } from "@/store/block/block-slice";
import { useRpcBlockData } from "@/store/block/hooks";
import { useAppDispatch } from "@/store/hooks";
import { numberConverTo } from "@/utils/math-format";
import { Container, Flex } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Block() {
    const searchParams = useSearchParams();
    const h = searchParams.get('h')
    const dispatch = useAppDispatch()

    const rpcBlock = useRpcBlockData()
    useEffect(() => {
        if (h) {
            dispatch(requestBlockInfoByHash({ hash: h }))
        }
    }, [h])

    useEffect(() => {
        if (rpcBlock && rpcBlock.digest) {
            document.title = `Block Height ${numberConverTo(rpcBlock.height)} - Neptune Explorer`;
        }
    }, [rpcBlock])

    return (
        <Container fluid p={"lg"}>
            <Flex direction={"column"} gap={16}>
                <BlockListCard />
                {/* <Space h={40} /> */}
                {/* <BlockInfoCard /> */}
                <BlockHashInfoTable hash={h ?? ""} />
                <BlockTransactionTable />
            </Flex>
        </Container>)
}