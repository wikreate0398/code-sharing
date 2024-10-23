import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { Stack, Typography } from '@mui/material'
import { TabItem, Tabs } from '#root/src/components/ui/tabs'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import classNames from 'classnames'

const Header = ({ title }) => {
    const classes = useStyles()
    const { isEditMode, tab, tabs, setTab } = useAddEditProjectContext()

    return (
        <Stack
            justifyContent="flex-start"
            flexDirection="column"
            gap="22px"
            className={classes.modalHeader}
        >
            <Typography variant="title-20" component="p">
                {title}
            </Typography>
            <Tabs fontSize={13}>
                {tabs.map((item) => {
                    let { name, type, enableAfterCreateProject } = item
                    let is = tab === type
                    return (
                        <TabItem
                            key={name}
                            active={is}
                            onClick={() => (isEditMode ? setTab(type) : null)}
                            className={classNames(classes.tabItem, {
                                [classes.tabItemDisabled]:
                                    !isEditMode && enableAfterCreateProject
                            })}
                        >
                            {name}
                        </TabItem>
                    )
                })}
            </Tabs>
        </Stack>
    )
}

export default Header
