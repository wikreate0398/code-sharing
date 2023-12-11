import classNames from 'classnames'

const AnimatesCircles = ({ color = 'white' }) => {
    const classes = classNames('loader-inner ball-pulse', `ball-pulse-${color}`)
    return (
        <div className={classes}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default AnimatesCircles
