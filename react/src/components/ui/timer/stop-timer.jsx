import { Box, Typography } from '@mui/material'
import { useTimerController } from '#root/src/hooks/useTimerController'
import useCounterController from '#root/src/hooks/useCounterController'
import StartStopTimerButton from '#root/src/components/ui/timer/button.js'
import classNames from 'classnames'
import { flexStartProps } from '#root/src/helpers/functions.js'
import { useRouter } from '#root/renderer/hooks'
import { taskRoute } from '#root/src/config/routes'
import { DefaultTooltip } from '#root/src/components/ui/tooltip/index.jsx'

const StopTimer = ({withTaskName = false, inTooltip = false, sm = false}) => {
    const { activeTimer, onStopTimer } = useTimerController()
    const {push} = useRouter()

    if (!activeTimer) return null

    const {id_project, id_board, id_task} = activeTimer

    const renderButton = () => (
        <StartStopTimerButton className={classNames('stop-mode', {
            withTaskName,
            sm
        })} {...(!withTaskName ? {onClick: onStopTimer} : {} )}>
            {Boolean(withTaskName) ? (
                <>
                    <Box className="task-name"
                         onClick={() => push(taskRoute(id_project, id_board, id_task))}>{activeTimer.task.name}</Box>
                    <Box {...flexStartProps('center')} className="counter-section" gap="10px" onClick={onStopTimer}>
                        <Counter data={activeTimer} />
                        <Stop short/>
                    </Box>
                </>
            ) : (
                <>
                    <Stop/>
                    <Counter data={activeTimer} />
                </>
            )}

        </StartStopTimerButton>
    )

    if (inTooltip) {
        return (
            <DefaultTooltip placement="bottom" arrow title={renderButton()} leaveDelay={300}>
                <Box className="square" style={{
                    width: '9px',
                    height: '9px',
                    cursor: 'pointer',
                    background: '#FF0000',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                }}/>
            </DefaultTooltip>
        )
    }

    return renderButton()
}

const Stop = ({short = false}) => (
    <Box className="stop">
        <Box className="square"/>
        {!short && <Typography variant="p-12" color="rgba(255,255,255,.5)">Стоп</Typography>}
    </Box>
)

export const Counter = ({ data }) => {
    const { seconds, hours, minutes, isStopped } = useCounterController(data)

    if (isStopped) return null

    return (
        <Box className="counter">
            {hours}:{minutes}:{seconds}
        </Box>
    )
}

export default StopTimer
