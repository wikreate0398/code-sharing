import { ErrorBoundary } from "@rollbar/react";

export { Page }

import React from 'react'

function Page() {
  return (
      <ErrorBoundary>
        <Center>
          <p style={{ fontSize: '1.3em' }}>Страница не найдена</p>

            <a href="/">Проекты</a>
        </Center>
      </ErrorBoundary>
  )
}

function Center({ style, ...props }: any) {
  return (
    <div
      style={{
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
          flexDirection: 'column',
        ...style
      }}
      {...props}
    ></div>
  )
}
