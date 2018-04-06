import {observable, action, runInAction,computed} from 'mobx'
import {getSingerList} from '../api/singer'

class Singers {
    @observable singers = []

    @action
    getSingerList = ()=>{
        getSingerList().then(res=>{
            const list = res.data.list
            runInAction(()=>{
                const _singerList = list.sort(this.sortByName)
                this.singers = _singerList.filter(songer=>/[a-zA-Z]/.test(songer.Findex)).concat(_singerList.filter(songer=>!/[a-zA-Z]/.test(songer.Findex)))
            })
        })
    }

    @computed get singerList(){ //歌手分组
        const _singers = []
        let currentIndex = ''
        this.singers.forEach(singer=>{
            if(singer.Findex!==currentIndex){
                currentIndex = singer.Findex
                const _a = [singer]
                _singers.push(_a)
            } else {
                _singers[_singers.length-1].push(singer)
            }
        })
        return _singers
    }

    sortByName(singer1,singer2){
        if (singer1.Findex < singer2.Findex ) {
            return -1;
        }
        if (singer1.Findex > singer2.Findex ) {
            return 1;
        }
        return 0;
    }
}

const singers = new Singers()

export default singers