import React from 'react'
import {Switch, Route,Redirect} from 'react-router-dom'
import Recommend from "../pages/recommend"
import Singer from "../pages/singer"
import Search from "../pages/search"
import Rank from "../pages/rank"
import MusicList from "../components/music-list"
// import asyncComponent from '../components/async-component'

// const Recommend = asyncComponent(()=>import('../pages/recommend'))
// const Singer = asyncComponent(()=>import('../pages/singer'))
// const Search = asyncComponent(()=>import('../pages/search'))
// const Rank = asyncComponent(()=>import('../pages/rank'))

export const CommonRouter = () => (
    <Switch>
        <Route exact path={'/'} render={()=><Redirect to={'/recommend'}/>}/>
        <Route exact path={'/recommend'} component={Recommend}/>
        <Route exact path={'/recommend/:id'} render={(props)=><MusicList {...props} type={'recommend'}/>}/>
        <Route exact path={'/singer'} component={Singer}/>
        <Route exact path={'/singer/:id'} component={(props)=><MusicList {...props} type={'singer'}/>}/>
        <Route exact path={'/search'} component={Search}/>
        <Route exact path={'/rank'} component={Rank}/>
        <Route exact path={'/rank/:id'} component={(props)=><MusicList {...props} type={'rank'}/>}/>
    </Switch>
)

