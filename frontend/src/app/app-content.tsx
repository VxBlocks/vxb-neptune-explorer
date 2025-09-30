'use client'
import { Header } from "@/components/header";
import ExploreHeader from "@/components/header/explore-header";
import Navbar from "@/components/navbar";
import { AppShell } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { Suspense } from "react";
import { PropsWithChildren } from "react";

function AppContent({ children }: PropsWithChildren) {
    const isMobile = useMediaQuery('(max-width: 768px)');
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AppShell
                withBorder={false}
                header={{ height: isMobile ? 60 : 0 }}
                navbar={{
                    width: 228,
                    breakpoint: 'sm', collapsed: { mobile: false }
                }}>
                <AppShell.Header hiddenFrom="sm">
                    <Header />

                </AppShell.Header>
                <AppShell.Navbar visibleFrom="sm">
                    <Navbar />
                </AppShell.Navbar>
                <AppShell.Main>
                    <ExploreHeader>
                        {children}
                    </ExploreHeader>
                </AppShell.Main>
            </AppShell>
        </Suspense>
    )
}

export default React.memo(AppContent)