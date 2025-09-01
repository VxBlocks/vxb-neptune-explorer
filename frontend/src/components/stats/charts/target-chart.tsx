import TitleText from '@/components/base/title-text';
import { useAppDispatch } from '@/store/hooks';
import { useLoadingTarget, useTargetChartDatas } from '@/store/stats/hooks';
import { requestTargetChartData } from '@/store/stats/stats-slice';
import { bigNumberMinus, bigNumberPlus, bigNumberTimes } from '@/utils/common';
import { stringConvertToTimestamp } from '@/utils/data-format';
import { numberConverTo } from '@/utils/math-format';
import { shortenNumber, timestampToDate } from '@/utils/tools';
import { Box, Card, Flex, LoadingOverlay, Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Text, ResponsiveContainer } from 'recharts';

export const TargetChartFilters = [
    { label: 'All', value: "all" },
    { label: 'Month', value: "month" },
    { label: 'Week', value: "week" },
    { label: 'Day', value: "day" },
]

export default function TargetChart() {
    const loading = useLoadingTarget()
    const targetChatDatas = useTargetChartDatas()
    const [viewData, setViewData] = useState<any>([])
    const [targetChartFilter, setTargetChartFilter] = useState("all")
    const dispatch = useAppDispatch();
    const showTimeLabels = ["week", "day"]
    useEffect(() => {
        if (targetChatDatas) {
            handleViewData()
        }
    }, [targetChatDatas])
    useEffect(() => {
        if (targetChartFilter) {
            dispatch(requestTargetChartData({
                duration: targetChartFilter
            }))
        }
    }, [targetChartFilter, dispatch])
    function handleViewData() {
        let datas = [] as any[]
        let newArray = targetChatDatas
        if (!showTimeLabels.includes(targetChartFilter) && targetChatDatas && targetChatDatas.length > 1) {
            newArray = targetChatDatas.slice(0, -1)
        }
        newArray && newArray.length > 0 && newArray.forEach((item) => {
            let timestamp = stringConvertToTimestamp(item.interv)
            datas.push({
                name: item.interv,
                uv: item.value,
                height: item.height,
                amt: item.height,
                data: showTimeLabels.includes(targetChartFilter) ? timestampToDate(timestamp, 'YYYY-MM-DD HH:mm') : timestampToDate(timestamp, 'YYYY-MM-DD')
            })
        })
        setViewData(datas)
    }

    const [domain, setDomain] = useState([] as any[])
    useEffect(() => {
        if (targetChatDatas) {
            finMaxAndMin()
        }
    }, [targetChatDatas])

    function finMaxAndMin() {
        if (targetChatDatas) {
            const max = Math.max.apply(Math, targetChatDatas.map(function (f: any) { return f.value }))
            const min = Math.min.apply(Math, targetChatDatas.map(function (f: any) { return f.value })) 
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
                        <p className="target" style={{ fontSize: '12px', color: "#8884d8" }}>{`Difficulty : ${numberConverTo(payload[0].value)}`}</p>
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
                    Difficulty Chart
                </TitleText>
                <Tabs
                    onChange={(value) => {
                        if (value) {
                            setTargetChartFilter(value);
                        }
                    }}
                    value={targetChartFilter}
                    variant={"pills"}>
                    <Tabs.List>
                        {
                            TargetChartFilters.map((item) => {
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
                    <AreaChart
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
                    </AreaChart>
                </ResponsiveContainer>
            </Box>

        </Flex>

    );
}
