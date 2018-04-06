import React from 'react'
import './index.scss'

export default class ProgressCircle extends React.PureComponent {

    render() {
        const {radius, percent, children} = this.props
        const dashArray = Math.PI * 100
        const dashOffset = (1 - percent / 100) * dashArray
        return (
            <div className="progress-circle">
                <svg width={radius} height={radius} viewBox={"0 0 100 100"} version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                    <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
                    <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}/>
                </svg>
                <div className="center">
                    {children}
                </div>
            </div>
        )
    }
}

ProgressCircle.defaultProps = {
    radius: 40,
    percent: 0
}