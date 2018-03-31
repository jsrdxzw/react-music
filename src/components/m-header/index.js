import React from 'react'
import IPerson from 'react-icons/lib/io/ios-person'
import './index.scss'

export default class MHeader extends React.PureComponent {

    render() {
        return (
            <div className={'header-container'}>
                <h1>Xu Music</h1>
                <IPerson className={'icon'}/>
            </div>
        )
    }
}