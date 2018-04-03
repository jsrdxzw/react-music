import React from 'react'
import './index.scss'

export default class Loader extends React.PureComponent {

    render() {
        return (
            <div className={'loading-container'}>
                <img src='./loading.gif' alt="" width={24} height={24}/>
                <p className="desc">{this.props.title}</p>
            </div>
        )
    }
}

Loader.defaultProps = {
    title: '正在载入...'
}