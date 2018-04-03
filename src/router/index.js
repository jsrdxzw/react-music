import React from 'react'
import {Switch, Route,Redirect} from 'react-router-dom'
import Recommend from "../pages/recommend"
import Singer from "../pages/singer"
import Search from "../pages/search"
import Rank from "../pages/rank"
import RecommendDetail from "../pages/recommend-detail"

export const CommonRouter = () => (
    <Switch>
        <Route exact path={'/'} render={()=><Redirect to={'/recommend'}/>}/>
        <Route exact path={'/recommend'} component={Recommend}/>
        <Route exact path={'/recommend/:id'} component={RecommendDetail}/>
        <Route exact path={'/singer'} component={Singer}/>
        <Route exact path={'/search'} component={Search}/>
        <Route exact path={'/rank'} component={Rank}/>
    </Switch>
)
