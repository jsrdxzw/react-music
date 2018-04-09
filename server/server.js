const express = require('express')
const axios = require('axios')
const path = require('path')

const app = new express();

app.use(express.static(path.resolve(__dirname,'../build')));

app.get('*',(req,res,next)=>{
    if(req.url.startsWith('/apiMusic')){
        next()
    } else {
        res.sendFile(path.resolve(__dirname,'../build/index.html'))
    }
})

app.get('/apiMusic/getDiscList',(req,res)=>{
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url,{
        headers:{
            referer:'https://c.y.qq.com/',
            host:'c.y.qq.com'
        },
        params:req.query
    }).then(response=>{
        res.json(response.data)
    }).catch(e=>console.log(e))
})

app.get('/apiMusic/getRecommend/songs',(req,res)=>{
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    axios.get(url,{
        headers:{
            referer:'https://c.y.qq.com/',
            host:'c.y.qq.com'
        },
        params:req.query
    }).then(response=>{
        res.json(response.data)
    }).catch(e=>console.log(e))
})


app.get('/apiMusic/getRecommend/lyric',(req,res)=>{
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    axios.get(url,{
        headers:{
            referer:'https://c.y.qq.com/',
            host:'c.y.qq.com'
        },
        params:req.query
    }).then(response=>{
        res.json(response.data)
    }).catch(e=>console.log(e))
})



app.listen(3336,function () {
    console.log('music api is listening at port 3336')
})