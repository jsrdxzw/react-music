import React from 'react'
import './index.scss'
import {Link} from 'react-router-dom'

export default class SingerGroup extends React.PureComponent {

    render() {
        const {singerGroup} = this.props
        return (
            <div className={'singer-group-container'}>
                <div className="title">{singerGroup[0].Findex}</div>
                {singerGroup.map(singer => (
                    <Link
                        to={
                            {
                                pathname: `/singer/${singer.Fsinger_mid}`,
                                search: `?bgImage=https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.Fsinger_mid}.jpg?max_age=2592000&title=${singer.Fsinger_name}`
                            }
                        }
                        key={singer.Fsinger_mid}
                    >
                        <div className={'singer'}>
                            <img
                                src={`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.Fsinger_mid}.jpg?max_age=2592000`}
                                alt=""/>
                            <div>{singer.Fsinger_name}</div>
                        </div>
                    </Link>
                ))}
            </div>
        )
    }
}