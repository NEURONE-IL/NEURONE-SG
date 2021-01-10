const axios = require("axios");
const connect = require('./connect');
const levelsJson = require('../../config/neuronegm/levels.json');
const GameElement = require('../../models/neuronegm/gameElement');

const getLevels = async (callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.get(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels',headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postLevel = async (level, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.post(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels', level, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const postAllLevels = async(callback) => {
    let levels = levelsJson.levels;
    let newGameElem;
    for(let i = 0; i<levels.length; i++){
        await postLevel(levels[i], (err, level) => {
            if(err){
                callback(err)
            }
            else{
                newGameElem = new GameElement({
                    type: "level",
                    key: levels[i].key,
                    gm_code: level.code
                })
                newGameElem.save();
            }
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    callback(null);
}

const updateLevel = async (level, code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.put(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels/'+code, level, headers.headers ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const deleteLevel = async (code, callback) => {
    await connect.getHeadersGM((err, headers) => {
        if(err){
            callback(err)
        }
        else{
            let credential = headers.credential;
            axios.delete(process.env.NEURONEGM+'/api/'+credential.app_code+'/levels/'+code, headers.headersheaders ).then((response)=> {
                callback(null, response.data.data)
            }).catch((err) => {
                callback(err);
            })
        }
    });
}

const level = {
    getLevels,
    postLevel,
    postAllLevels,
    updateLevel,
    deleteLevel
};

module.exports = level;
