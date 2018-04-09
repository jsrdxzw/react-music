import {observable, action, runInAction} from 'mobx'
import {getTopList} from '../api/rank'

class Rank {
    @observable topList = []

    @action
    getTopList = () => {
        getTopList().then((res) => {
            runInAction(() => {
                this.topList = res.data.topList
            })
        })
    }
}

const rank = new Rank()

export default rank