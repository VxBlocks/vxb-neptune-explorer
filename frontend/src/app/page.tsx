
'use client'
import OverviewCard from '@/components/home/card/overview-card'
import SearchCard from '@/components/home/card/search-card'
import LastestBlocksContent from '@/components/home/latest-blocks-content'
import LatestTxsContent from '@/components/home/latest-txs-content'
import { requestLatestBlocks } from '@/store/block/block-slice'
import { useAppDispatch } from '@/store/hooks'
import { requestOverviewInfoData } from '@/store/overview/overview-slice'
import { requestLatestTxs } from '@/store/txs/txs-slice'
import { requestLatestUtxos } from '@/store/utxo/utxo-slice'
import { Container, Flex, Grid } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect } from 'react'
export default function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(requestOverviewInfoData())
    dispatch(requestLatestBlocks())
    dispatch(requestLatestUtxos())
    dispatch(requestLatestTxs())
  }, [dispatch])
  useEffect(() => {
    document.title = `Home - Neptune Explorer`;
  }, []) 
  return (
    <Container fluid>
      <Flex direction={"column"} gap={16} px={20}> 
        <SearchCard />
        <OverviewCard />
        <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 30 }}>
          <Grid.Col span={"auto"}> <LastestBlocksContent /></Grid.Col>
          <Grid.Col span={isMobile ? 12 : 9.7}> <LatestTxsContent /></Grid.Col>
        </Grid>
      </Flex>
    </Container>
  )
}