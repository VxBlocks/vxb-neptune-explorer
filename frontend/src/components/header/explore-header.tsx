import { Flex } from "@mantine/core";
import NetworkContent from "../home/network-content";
import React from "react";
import HyperliquidContent from "../home/hyperliquid-content";

export default function ExploreHeader({ children }: { children: React.ReactNode }) {
    return (<>
        <Flex direction={"row"} justify="space-between" w={"100%"} px={30} wrap="nowrap" style={{ margin: "10px 0" }} visibleFrom="sm">
            <Flex></Flex>
            <Flex direction={"row"} gap={16}>
                <HyperliquidContent />
                <NetworkContent />
            </Flex>
        </Flex>
        {children}
    </>)
}