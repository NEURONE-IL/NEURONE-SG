const axios = require("axios");
const connect = require('./connect');
const pointsJson = require('../../config/neuronegm/points.json');
const GameElement = require('../../models/neuronegm/gameElement');

const getPoints = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/points',headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postPoint = async (point, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/points', point, headers.headers  ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postAllPoints = async(callback) => {
    let points = pointsJson.points;
    let newGameElem;
    for(let i = 0; i<points.length; i++){
        await postPoint(points[i], (err, point) => {
            if(err){
                console.log(err)
            }
            else{
                newGameElem = new GameElement({
                    type: "point",
                    key: points[i].key,
                    gm_code: point.code
                })
                newGameElem.save();
            }
        })
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    callback(null);
}

const updatePoint = async (point, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/points/'+code, point, headers.headers  ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const deletePoint = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/points/'+code, headers.headers  ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const givePoints = async (post, player_code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/players/'+ player_code+'/give-points' , post, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            });
        }
    });
}

const point = {
    getPoints,
    postPoint,
    postAllPoints,
    updatePoint,
    deletePoint,
    givePoints
};

module.exports = point;
