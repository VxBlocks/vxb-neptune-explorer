import NavTextLink from "@/components/base/nav-text-link";
import { TimeClock } from "@/components/TimeClock";
import { updateLatestBlocks } from "@/store/block/block-slice";
import { useLatestBlocks, useLatestWsBlock } from "@/store/block/hooks";
import { useAppDispatch } from "@/store/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { numberConverTo } from "@/utils/math-format";
import { Card, Flex, Text, UnstyledButton } from "@mantine/core";
import { IconCube } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LatestBlocksTable() {
    const latestBlocks = useLatestBlocks()
    const wsBlock = useLatestWsBlock()
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (wsBlock) {
            dispatch(updateLatestBlocks())
        }
    }, [wsBlock])
    const router = useRouter()

    return (
        <Flex direction={"column"} gap={"sm"}>
            {
                latestBlocks && latestBlocks.map((item, index) => {
                    let data = stringConvertToTimestamp(item.time)
                    return (<Card key={item.block} withBorder radius={8} p={"8px"}>
                        <Flex direction={"column"} gap={8}>
                            <Flex direction={"row"} justify={"space-between"} align={"center"}>
                                <Flex direction={"row"} align={"center"} gap={16}>
                                    <IconCube size={18} />
                                    <NavTextLink style={{ fontSize: "18px" }} href={`/block?h=${item.block}`} >
                                        {numberConverTo(item.block)}
                                    </NavTextLink>
                                </Flex>
                                <TimeClock timeStamp={data} style={{ fontSize: "14px", color: "#858585" }} />
                            </Flex>
                            <Flex direction={"row"} gap={8}>
                                <Text style={{ fontSize: "14px", color: "#332526" }}>
                                Outputs
                                </Text>
                                <Text style={{ fontSize: "14px", color: "#858585" }}>
                                    {item.outputs}
                                </Text>
                            </Flex>
                        </Flex>
                    </Card>)
                })
            }
            {
                latestBlocks && latestBlocks.length === 5 &&
                <Flex justify={"center"}>
                    <UnstyledButton component="a"
                        onClick={() => {
                            router.push("/blocks")
                        }}>
                        View all blocks
                    </UnstyledButton>
                </Flex>
            }

        </Flex>)
}