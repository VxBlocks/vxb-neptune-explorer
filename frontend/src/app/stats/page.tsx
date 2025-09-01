'use client'
import CustomPieChart from "@/components/base/charts/customPieChart"
import GuesserChart from "@/components/stats/charts/guesser-chart"
import RewardChart from "@/components/stats/charts/reward-chart"
import TargetChart from "@/components/stats/charts/target-chart"
import { useAppDispatch } from "@/store/hooks"
import { requestOverviewInfoData } from "@/store/overview/overview-slice"
import { requestRewardChartData, requestTargetChartData } from "@/store/stats/stats-slice"
import { Container, Flex } from "@mantine/core"
import { useEffect } from "react"
const Stats = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        document.title = `Charts & Stats - Neptune Explorer`;
    }, [])
    useEffect(() => {
        dispatch(requestOverviewInfoData()) 
    }, [dispatch])
    return (<Container fluid p={"lg"}>
        <Flex direction={"column"} gap={16}>
            <CustomPieChart />
            <TargetChart />
            <RewardChart />
            {/* <GuesserChart /> */}
        </Flex>
    </Container>)
}

export default Stats