import RootLayout from "#root/src/components/layouts/root-layout";
export { PageShell }
import React from "react";
import { PageContextProvider} from "#root/renderer/hooks";
import DashboardLayout from "#root/src/components/layouts/dashboard-layout";
import '#root/public/css/global.css'
import ProjectProvider from "#root/src/providers/project-provider";
import AuthProvider from "#root/src/providers/auth-provider";
import { Provider as RollbarProvider } from '@rollbar/react';
import {Compose} from "#root/src/helpers/components";

const rollbarConfig = {
    enabled: import.meta.env.VITE_APP_ENV === 'production',
    accessToken: 'd9f972d0560d4db0a9cdb5709a599ae5',
    autoInstrument: true,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: import.meta.env.VITE_APP_ENV,
        client: {
            javascript: {
                code_version: '1.0.0',
                source_map_enabled: true,
                guess_uncaught_frames: true
            }
        }
    },
    transform: (payload) => {
        const trace = payload.body.trace
        const locRegex = /^(https?):\/\/[a-zA-Z0-9:._-]+\/(.*)/

        if (trace && trace.frames) {
            for (const frame of trace.frames) {
                if (frame.filename) {
                    const m = frame.filename.match(locRegex)

                    if (m !== null && m.length > 2)
                        frame.filename = m[1] + '://itway.bz/' + m[2]
                }
            }
        }
    }
};

function PageShell({ pageContext, children }) {

    const layouts = []
    if (pageContext.urlPathname.startsWith('/dashboard')) {
        layouts.push(AuthProvider)
        layouts.push(DashboardLayout)
    }

    if (/^\/dashboard\/p\/[1-9]/i.test(pageContext.urlPathname)) {
        layouts.push(ProjectProvider)
    }

    return (
        <RollbarProvider config={rollbarConfig}>
            <PageContextProvider pageContext={pageContext}>
                <RootLayout pageContext={pageContext}>
                    <Compose items={layouts}>{children}</Compose>
                </RootLayout>
            </PageContextProvider>
        </RollbarProvider>
    )
}