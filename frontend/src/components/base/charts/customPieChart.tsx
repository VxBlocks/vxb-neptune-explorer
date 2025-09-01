import { useOverviewData } from '@/store/overview/hooks';
import { bigNumberDiv, bigNumberMinusToString } from '@/utils/common';
import { numberConverTo, numberConverToNoCommas, tokenFormat } from '@/utils/math-format';
import { Card, Flex, Grid, Text } from '@mantine/core';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { useRef, useState, useEffect } from 'react';

import Editor from "@/components/MDEditor";
import { NEPTUNE_TOKEMOCIS_NOTISTICE } from '@/config';

export default function CustomPieChart() {
    const divRef = useRef<any>(null);
    const overviewData = useOverviewData()
    const [currentWidth, setCurrentWidth] = useState<number>(0);

    function handlePowRewardLock() { 
        let powReward = overviewData?.total_fee;
        let powRewardLock = tokenFormat(bigNumberDiv(powReward, 2))
        return powRewardLock
    }
    function handlePowRewardUnlock() {
        return handlePowRewardLock()
    }
    function handleComposeRewardlock() {
        let totalReward = overviewData?.total_reward;
        let powReward = overviewData?.total_fee;
        let diff = bigNumberMinusToString(totalReward, powReward)
        let composeRewardUnlock = tokenFormat(bigNumberDiv(diff, 2))
        return composeRewardUnlock
    }
    function handleComposeRewardUnlock() {
        return handleComposeRewardlock()
    }

    function handleOther() {
        let other = 42000000 - (handlePowRewardLock() + handlePowRewardUnlock() + handleComposeRewardlock() + handleComposeRewardUnlock())
        return other
    }

    useEffect(() => {
        if (divRef.current) {
            const width = divRef.current.ele.clientWidth;
            setCurrentWidth(width)
        }
    }, []);
    const [options, setOptions] = useState({} as any)
    useEffect(() => {
        handleDatas(currentWidth)
    }, [overviewData && currentWidth])
    function handleDatas(width: number) {
        let datas = [
            [
                { name: 'Pow Reward Unlock', value: handlePowRewardUnlock() },
                { name: 'Compose Reward UnLock', value: handleComposeRewardUnlock() },
                { name: 'Premine Lock', value: 831600.0000 },
                { name: 'Pow Reward Lock', value: handlePowRewardLock() },
                { name: 'Compose Reward Lock', value: handleComposeRewardlock() },
                { name: 'The portion yet to be mined', value: handleOther(), itemStyle: { color: '#d3d3d3' } }
            ]
        ]
        const option = {
            title: {
                text: '42,000,000',
                left: 'center',
                top: 'center',
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'bold'
                }
            },
            grid: { top: 0, right: 0, bottom: 0, left: 0 },
            series: datas.map(function (data, idx) {
                return {
                    type: 'pie',
                    radius: [60, 180],
                    height: '100%',
                    left: 'center',
                    width: "90%",
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1
                    },
                    label: {
                        alignTo: 'edge', 
                        formatter: function (labeldata: any) {
                            return labeldata.name
                                + "\n"
                                + numberConverToNoCommas(labeldata.value)
                        },
                        minMargin: 5,
                        edgeDistance: 10,
                        lineHeight: 15,
                    },
                    labelLine: {
                        length: 15,
                        length2: 0,
                        maxSurfaceAngle: 80
                    },
                    labelLayout: function (params: any) {
                        const isLeft = params.labelRect.x < (width / 2);
                        const points = params.labelLinePoints as number[][];
                        if (points && points.length > 2) { 
                            points[2][0] = isLeft
                                ? params.labelRect.x
                                : params.labelRect.x + params.labelRect.width;
                        }
                        return {
                            labelLinePoints: points
                        };
                    },
                    data: data
                };
            })
        };
        setOptions(option)
    }
    return (<Card>
        <Flex justify="center" align="center" style={{ height: '100%' }}>
            <Text size="xl" style={{ margin: 'auto', fontSize: '24px', fontWeight: 'bold' }}>
                Neptune Tokenomics
            </Text>
        </Flex>
        <Card.Section>
            <Grid gutter="md" visibleFrom='sm'>
                <Grid.Col span={4}>
                    <Editor
                        className="border-none rounded-[16px] bg-transparent"
                        style={{ height: 'auto', lineHeight: '0px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        value={NEPTUNE_TOKEMOCIS_NOTISTICE}
                        view={{ menu: false, md: false, html: true, both: false, fullScreen: true, hideMenu: false }}
                        onChange={() => { }}
                    />
                </Grid.Col>
                <Grid.Col span={"auto"}>
                    <ReactEcharts
                        ref={divRef}
                        echarts={echarts}
                        style={{
                            width: '100%',
                            height: "450px", display: 'flex', position: 'relative'
                        }}
                        option={options} />
                </Grid.Col>
            </Grid>
            <Grid gutter="md" hiddenFrom='sm'>
                <Grid.Col span={12}>
                    <Editor
                        className="border-none rounded-[16px] bg-transparent"
                        style={{ height: 'auto', lineHeight: '0px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        value={NEPTUNE_TOKEMOCIS_NOTISTICE}
                        view={{ menu: false, md: false, html: true, both: false, fullScreen: true, hideMenu: false }}
                        onChange={() => { }}
                    />
                </Grid.Col>
                <Grid.Col span={"auto"}>
                    <ReactEcharts
                        ref={divRef}
                        echarts={echarts}
                        style={{
                            width: '100%',
                            height: "450px", display: 'flex', position: 'relative'
                        }}
                        option={options} />
                </Grid.Col>
            </Grid>
        </Card.Section>


    </Card>)
}