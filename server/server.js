const express = require('express')
const axios = require('axios')

const app = new express();

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
};

app.use(allowCrossDomain)

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



app.listen(3333,function () {
    console.log('music api is listening at port 3333')
})