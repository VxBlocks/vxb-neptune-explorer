import { IconApi, IconChartBar, IconCube, IconDatabaseCog, IconTransfer, IconWorld } from "@tabler/icons-react";

export const linkdata = [
    {
        label: 'Blockchain', icon: IconWorld, links: [
            {
                icon: IconCube,
                label: "Blocks",
                link: "/blocks",
            },
            {
                icon: IconCube,
                label: "Forks",
                link: "/forks",
            },
            {
                icon: IconTransfer,
                label: "Transactions",
                link: "/txs",
            },
            {
                icon: IconTransfer,
                label: "Utxos",
                link: "/utxos",
            },
        ]
    },
    { label: 'Tokens', href: "/tokens", icon: IconDatabaseCog },
    { label: 'Charts & Stats', icon: IconChartBar, href: "/stats" },
    { label: 'API', icon: IconApi, href: "/doc-api" },
];

export const mobileLinkdata = [
    { label: 'Blocks', href: "/blocks", icon: IconCube },
    { label: 'Forks', href: "/forks", icon: IconCube },
    { label: 'Transactions', href: "/txs", icon: IconTransfer },
    { label: 'Utxos', href: "/utxos", icon: IconTransfer },
    { label: 'Tokens', href: "/tokens", icon: IconDatabaseCog },
    { label: 'Charts & Stats', icon: IconChartBar, href: "/stats" },
    { label: 'API', icon: IconApi, href: "/doc-api" },
];