import TitleText from "@/components/base/title-text";
import { TimeClock } from "@/components/TimeClock";
import { useLatestWsBlock } from "@/store/block/hooks";
import { useAppDispatch } from "@/store/hooks";
import { useLoadingOverview, useOverviewData } from "@/store/overview/hooks";
import { updateOverviewInfoData } from "@/store/overview/overview-slice";
import { bigNumberDiv, bigNumberDivToString, bigNumberPlus } from "@/utils/common";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { numberConverTo, tokenFormat } from "@/utils/math-format";
import { shortenNumberG, shortenNumberUnits } from "@/utils/tools";
import { Box, Card, Flex, Grid, LoadingOverlay, Skeleton, Text, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function OverviewCard() {
    const loading = useLoadingOverview()
    const overviewData = useOverviewData()
    const wsBlock = useLatestWsBlock()
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (wsBlock) {
            dispatch(updateOverviewInfoData())
        }
    }, [wsBlock])

    function BaseCard({ title, children, tip, units }: { title: string, children: React.ReactNode, tip?: string, units?: string }) {
        return (
            <Card padding="xs" radius="md" bg={"#F5FAFF"}>
                <Skeleton visible={!title}>
                    <Flex direction={"row"}
                        gap={4} justify="flex-start"
                        align="center"
                        style={{
                            whiteSpace: "nowrap"
                        }}>
                        <Text style={{ color: "#332526", fontWeight: "400", fontSize: "12px" }}>{title}</Text>
                        {
                            tip && <Tooltip label={tip}>
                                <IconInfoCircle size={12} />
                            </Tooltip>
                        }
                    </Flex>

                </Skeleton>
                <Skeleton visible={!children}>
                    <Flex direction={"row"} gap={4} justify="flex-start" align="flex-end">
                        <Text style={{ color: "#1D8282", fontWeight: "400", fontSize: "16px" }}>{children}</Text>
                        {units && <Text style={{ color: "#332526", fontWeight: "400", fontSize: "14px", }}>
                            {units}
                        </Text>
                        }
                    </Flex>
                </Skeleton>

            </Card>
        )
    }
    const [options, setOptions] = useState([] as any[])

    useEffect(() => {
        if (overviewData) {
            handleOverviewData()
        }
    }, [overviewData])

    function queryTimes(ts: any) {
        let minute = Math.trunc(bigNumberDiv(ts, 60))
        let second = Math.floor(ts % 60)
        if (minute <= 0) {
            return (`${getSec(second)}`)
        } else {
            return (`${getMin(minute)} ${getSec(second)}`)
        }
    }

    function getSec(second: number) {
        return `${second} s`
    }

    function getMin(minute: number) {
        return `${minute} m`
    }

    function handleNptSupply() {  
        let halfTotalReward = tokenFormat(bigNumberDiv(overviewData?.total_reward ?? 0, 2)) 
        return numberConverTo(halfTotalReward)
    }
    function handleLockedNptSupply() {
        let base = 831600
        let halfTotalReward = tokenFormat(bigNumberDivToString(overviewData?.total_reward ?? 0, 2))
        let nptSupply = bigNumberPlus(base, halfTotalReward)
        return numberConverTo(nptSupply)
    }

    function handleHashrate() { 
        let dailyPowReward = tokenFormat(overviewData?.day_fee)
        let speedG = shortenNumberG(overviewData?.network_speed_24h ?? "")
        let hashrate = "--"
        if (speedG) {
            let formatHashrate = Number(bigNumberDiv(dailyPowReward, speedG).toFixed(4))
            hashrate = numberConverTo(formatHashrate)
        }
        return hashrate
    }

    function handleOverviewData() {
        const options = [
            {
                title: "Block Height",
                value: numberConverTo(overviewData?.height)
                ,
            },
            {
                title: "Latest Block",
                value: <TimeClock timeStamp={stringConvertToTimestamp(overviewData?.timestamp ?? "")}></TimeClock>,
            },
            {
                title: "Average Block Time (Daily)",
                value: queryTimes(overviewData?.average_block_time),
            },
            {
                title: "Difficulty",
                value: numberConverTo(overviewData?.proof_target),
            },

            {
                title: "Cumulative Difficulty",
                value: numberConverTo(shortenNumberUnits(overviewData?.cumulative_proof_of_work ?? "").shortenNumber),
                unit: shortenNumberUnits(overviewData?.cumulative_proof_of_work ?? "").unit,
            },
            {
                title: "Circulating NPT Supply",
                value: handleNptSupply(),
            },
            {
                title: "Locked NPT Supply",
                value: handleLockedNptSupply(),
            },
            {
                title: "Guesser's Reward",
                value: numberConverTo(tokenFormat(overviewData?.total_fee)),
            },

            {
                title: "Utxo Count",
                value: numberConverTo(overviewData?.utxo_count),
            },
            {
                title: "Tx Count",
                value: numberConverTo(overviewData?.tx_count),
                tip: "Start Block Height: 5,669",
            },
            {
                title: "Daily Rewards",
                value: numberConverTo(tokenFormat(overviewData?.day_reward)),
            },
            {
                title: "Daily Guesser's Reward",
                value: numberConverTo(tokenFormat(overviewData?.day_fee)),
            },
            {
                title: "1G/s Hashrate Estimated Daily Reward",
                value: handleHashrate(),
            },
            {
                title: "Estimated Network Speed (Daily)",
                value: numberConverTo(shortenNumberUnits(overviewData?.network_speed_24h ?? "").shortenNumber),
                unit: shortenNumberUnits(overviewData?.network_speed_24h ?? "").unit + "/s",
            },

        ]
        setOptions(options)
    }

    return (<Flex direction={"column"} w={"100%"} gap={8}>
        <TitleText>
            Network Overview
        </TitleText>
        <Box pos="relative">
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Grid columns={15} gutter={{ base: 5, xs: 'md', md: 'xl', xl: "md" }}>
                {
                    options.map((item, index) => {
                        return (<Grid.Col key={index} span={{ base: 16, md: 7, lg: 3 }}>
                            <BaseCard title={item.title} units={item.unit} tip={item.tip}>
                                {item.value}
                            </BaseCard>
                        </Grid.Col>)
                    })
                }
            </Grid>
        </Box>

    </Flex >)
}
