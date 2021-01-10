const axios = require("axios");
const connect = require('./connect');
const badgesJson = require('../../config/neuronegm/badges.json');
const GameElement = require('../../models/neuronegm/gameElement');

const getBadges = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/badges',headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postBadge = async (badge, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/badges', badge, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postAllBadges = async(callback) => {
    let badges = badgesJson.badges;
    let newGameElem;
    for(let i = 0; i<badges.length; i++){
        await postBadge(badges[i], (err, badge) => {
            if(err){
                console.log(err)
            }
            else{
                newGameElem = new GameElement({
                    type: "badge",
                    key: badges[i].key,
                    gm_code: badge.code
                })
                newGameElem.save();
            }
        })
    }
    callback(null);
}

const updateBadge = async (badge, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/badges/'+code, badge, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const deleteBadge = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{   
            let credential = headers.credential;
            axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/badges/'+code, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const badge = {
    getBadges,
    postBadge,
    postAllBadges,
    updateBadge,
    deleteBadge
};

module.exports = badge;
