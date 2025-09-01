import { Lexend_Deca } from 'next/font/google';
import "./globals.css";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import SotoreInitor from '@/components/store-initor';
import { Notifications } from "@mantine/notifications";
import AppContent from './app-content';
import theme from '@/theme';
import { GoogleAnalytics } from '@next/third-parties/google'


export const metadata = {
  title: 'Neptune Explorer',
}

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang={'en'} className="h-full" data-theme="light">
      <body className={lexendDeca.className}>
        <GoogleAnalytics gaId="G-46NL8XKNWG" />
        <SotoreInitor>
          <MantineProvider theme={theme}>
            <Notifications />
            <AppContent>
              {children}
            </AppContent>
          </MantineProvider>
        </SotoreInitor>
      </body>
    </html>
  )
}

export default LocaleLayout