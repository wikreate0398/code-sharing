import { formatDuration, roundSecToMin } from '#root/src/helpers/functions'

export const MIN_HEIGHT = 1000 // seconds to make min height of items in chart

export const getStatsGraphChart = ({ legend, allProjects }) => ({
    tooltip: {
        show: true,
        formatter: function (data, index) {
            const { seriesName, value, name, color } = data
            let v = formatDuration({ ammount: value - MIN_HEIGHT })
            return `<div style="display: flex; flex-direction: row; gap: 4px">
                        <p style="font-size: 16px">${seriesName}</p>
                        <p style="font-size: 13px">${name}</p>
                    </div> 
                    <b> ${v}</b>
            `
        }
    },
    xAxis: {
        type: 'category',
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#9EA2B2',
            fontSize: '11px',
            margin: 10
        },
        data: legend || ['Пн', 'Вт', 'Ср']
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false,
            lineStyle: {
                color: '#9EA2B2',
                fontSize: '11px'
            }
        },
        axisLabel: {
            formatter: function (value, index) {
                return formatDuration({
                    ammount: roundSecToMin(value),
                    type: 'minutes',
                    symbols: ['hours']
                })
            }
        }
    },
    grid: { top: 10, bottom: 20, left: 38, right: 10 },
    series: allProjects,
    fontFamily: 'Inter'
})

export const roundChartStackBorders = (series) => {
    const stackInfo = {}

    for (let i = 0; i < series[0].data.length; ++i) {
        for (let j = 0; j < series.length; ++j) {
            const stackName = series[j].stack
            if (!stackName) {
                continue
            }
            if (!stackInfo[stackName]) {
                stackInfo[stackName] = {
                    stackStart: [],
                    stackEnd: []
                }
            }
            const info = stackInfo[stackName]
            const data = series[j].data[i]
            if (data && data !== '-') {
                if (info.stackStart[i] == null) {
                    info.stackStart[i] = j
                }
                info.stackEnd[i] = j
            }
        }
    }

    for (let i = 0; i < series.length; ++i) {
        const data = series[i].data
        const info = stackInfo[series[i].stack]
        for (let j = 0; j < series[i].data.length; ++j) {
            // const isStart = info.stackStart[j] === i;
            const isEnd = info.stackEnd[j] === i
            const topBorder = isEnd ? 5 : 0
            const bottomBorder = 0
            data[j] = {
                value: data[j],
                itemStyle: {
                    borderRadius: [
                        topBorder,
                        topBorder,
                        bottomBorder,
                        bottomBorder
                    ]
                }
            }
        }
    }

    return series
}
