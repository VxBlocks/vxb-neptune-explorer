import { useOverviewData } from '@/store/overview/hooks';
import { bigNumberDiv, bigNumberMinusToString } from '@/utils/common';
import { tokenFormat } from '@/utils/math-format';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { useEffect, useRef, useState } from 'react';
export default function CustomBarChart() {
    const divRef = useRef<any>(null);
    const overviewData = useOverviewData()
    const [currentWidth, setCurrentWidth] = useState<number>(0);
    useEffect(() => {
        if (divRef.current) {
            const width = divRef.current.ele.clientWidth;
            setCurrentWidth(width)
        }

    }, []); 

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
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: [60, 160],
                data: [
                    { value: 832600, name: 'Premine Unlock' },
                    { value: handlePowRewardUnlock(), name: 'Pow Reward Unlock' },
                    { value: handleComposeRewardUnlock(), name: 'Compose Reward UnLock' },
                    { value: handlePowRewardLock(), name: 'Pow Reward Lock' },
                    { value: handleComposeRewardlock(), name: 'Compose Reward Lock' },
                    { value: handleOther(), name: 'The portion yet to be mined' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    return (
        <ReactEcharts
            ref={divRef}
            echarts={echarts}
            style={{ width: '100%', height: "540px", display: 'flex', position: 'relative' }}
            option={option} />
    )
}