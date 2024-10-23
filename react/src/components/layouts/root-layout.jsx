import React from 'react';
import ThemeRegistry from "#root/src/providers/theme-registry";
import guard from "#root/src/middleware.js";

const RootLayout = ({children, pageContext}) => {
    return guard(pageContext, <ThemeRegistry>{children}</ThemeRegistry>)
}

export default RootLayout;