import TitleText from '@/components/base/title-text';
import { useAppDispatch } from '@/store/hooks';
import { useLoadingReward, useRewardChartDatas } from '@/store/stats/hooks';
import { requestRewardChartData } from '@/store/stats/stats-slice';
import { bigNumberMinus, bigNumberPlus, bigNumberTimes } from '@/utils/common';
import { stringConvertToTimestamp } from '@/utils/data-format';
import { numberConverTo, tokenFormat } from '@/utils/math-format';
import { shortenNumber, timestampToDate } from '@/utils/tools';
import { Box, Card, Flex, LoadingOverlay, Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

export const RewardChartFilters = [
    { label: 'All', value: "all" },
    { label: 'Month', value: "month" },
    { label: 'Week', value: "week" },
    { label: 'Day', value: "day" },
]

export default function RewardChart() {
    const loading = useLoadingReward()
    const rewardChatDatas = useRewardChartDatas()
    const [viewData, setViewData] = useState<any>([])
    const [rewardChartFilter, setTargetChartFilter] = useState("all")
    const showTimeLabels = ["week", "day"]
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (rewardChatDatas) {
            handleViewData()
        }
    }, [rewardChatDatas])
    useEffect(() => {
        if (rewardChartFilter) {
            dispatch(requestRewardChartData({
                duration: rewardChartFilter
            }))
        }
    }, [rewardChartFilter, dispatch])
    function handleViewData() {
        let datas = [] as any[]
        let newArray = rewardChatDatas
        if (!showTimeLabels.includes(rewardChartFilter) && rewardChatDatas && rewardChatDatas.length > 1) {
            newArray = rewardChatDatas.slice(0, -1)
        }
        newArray && newArray.length > 0 && newArray.forEach((item) => {
            let timestamp = stringConvertToTimestamp(item.interv)
            datas.push({
                name: item.interv,
                uv: tokenFormat(item.value),
                pv: tokenFormat(item.fee),
                height: item.height,
                amt: item.height,
                data: showTimeLabels.includes(rewardChartFilter) ? timestampToDate(timestamp, 'YYYY-MM-DD HH:mm') : timestampToDate(timestamp, 'YYYY-MM-DD')
            })
        })
        setViewData(datas)
    }

    const [domain, setDomain] = useState([] as any[])
    useEffect(() => {
        if (rewardChatDatas) {
            finMaxAndMin()
        }
    }, [rewardChatDatas])

    function finMaxAndMin() {
        if (rewardChatDatas) {
            const max = Math.max.apply(Math, rewardChatDatas.map(function (f: any) { return tokenFormat(f.value) }))
            const min = Math.min.apply(Math, rewardChatDatas.map(function (f: any) { return tokenFormat(f.value) })) 
            let minValue = bigNumberMinus(min, bigNumberMinus(bigNumberMinus(max, min), 0.1)) > 0 ? bigNumberMinus(min, bigNumberMinus(bigNumberMinus(max, min), 0.1)) : 0
             
            let maxValue = bigNumberPlus(max, bigNumberTimes(bigNumberMinus(max, min), 0.1))
 
            let roundedMin = Math.floor(minValue) 
            let roundedMax = Math.ceil(maxValue);
            if (roundedMin === roundedMax) {
                if (roundedMax === 0) {
                    setDomain([])
                } else {
                    setDomain([roundedMin, roundedMax])
                }
            } else {
                setDomain([roundedMin, roundedMax])
            }
        }
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) { 
            return (
                <Card shadow='sm'>
                    <div className="custom-tooltip">
                        <p className="label">{`${label}`}</p>
                        <p className="target" style={{ fontSize: '12px', color: "#8884d8" }}>{`Total Reward : ${numberConverTo(payload[0].value)}`}</p>
                        <p className="target" style={{ fontSize: '12px', color: "#ffc658" }}>{`Guesser's Reward : ${numberConverTo(payload[1].value)}`}</p>
                    </div>
                </Card>
            );
        }

        return null;
    };

    return (
        <Flex direction={"column"} w={"100%"} gap={16}>
            <Flex align={"center"} w={"100%"} justify={"space-between"}>
                <TitleText>
                    Reward Chart
                </TitleText>
                <Tabs
                    onChange={(value) => {
                        if (value) {
                            setTargetChartFilter(value);
                        }
                    }}
                    value={rewardChartFilter}
                    variant={"pills"}>
                    <Tabs.List>
                        {
                            RewardChartFilters.map((item) => {
                                return <Tabs.Tab size={"sm"} key={item.value} value={item.value}>
                                    {item.label}
                                </Tabs.Tab>
                            })
                        }
                    </Tabs.List>
                </Tabs>
            </Flex>
            <Box pos="relative">
                <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
                <ResponsiveContainer width={"100%"} height={300}>
                    <ComposedChart
                        data={viewData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#459F89" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#459F89" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="data" fontSize={12} />
                        <YAxis
                            interval="preserveEnd"
                            tickCount={6}
                            domain={domain}
                            tickFormatter={(value, index) => {
                                return shortenNumber(value);
                            }} fontSize={12}
                        />
                        <Tooltip content={<CustomTooltip />} />  
                        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />

                        <Area type="monotone" dataKey="pv" stroke="#ffc658" fill="#ffc658" />
                        {/* <Line type="monotone" dataKey="pv" stroke="#ffc658" /> */}
                    </ComposedChart>
                </ResponsiveContainer>
            </Box>

        </Flex>

    );
}
