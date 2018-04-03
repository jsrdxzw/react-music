import {observable, action, runInAction} from 'mobx'
import {getRecommend, getDiscList} from '../api/recommend'

class Recommend {
    @observable sliders = []
    @observable discs = []

    @action
    getSliders = () => {
        getRecommend().then(res => {
            runInAction(() => {
                this.sliders = res.data.slider
            })
        }).catch(e => console.log(e))
    }

    @action
    getDiscs = () => {
        getDiscList().then(res => {
            runInAction(() => {
                this.discs = res.data.list
            })
        }).catch(e => console.log(e))
    }
}

const recommend = new Recommend()

export default recommend