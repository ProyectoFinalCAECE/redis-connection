var Redis = require('ioredis');
var config = require('../../config/redis-credentials.json');

exports.getConnection = function(session){
  return new Redis({
                    port: config.port,
                    host: config.host,
                    family: 4,
                    password: config.password,
                    db: config.db,
                    retryStrategy: function (times) {
                      var delay = Math.min(times * 2, 2000);
                      return delay;
                    }
                  })
}


exports.isAlive = function(session){
    return true;
}


exports.killSession = function(){
    /*if(isAlive(RedisStore)){
        RedisStore.quit();
    }*/

    return true;
}

exports.backupUserSessions = function(){
    return true;
}

exports.getClient = function(){
     //return redis.createClient(config.port, config.host, config.password);
    return redis.createClient(config.port, config.host);
}

exports.closeClient = function(client){
     return client.end();
}

function saveUserKeyToRedis (user_key, session_id){

    console.log('into saveUserKeyToRedis. Session ID: ' + session_id);

    //var client = redis.createClient(config.port, config.host, config.password);
    var client = redis.createClient(config.port, config.host);
    client.set(user_key, session_id, function(err, reply) {
                console.log(reply);
                if(err)
                    throw new Error('Error storing key at redis: ' + err);
                });

    //This key expires in 30 minutes
    client.expire(user_key, 1800);
    client.end();
    console.log('into saveUserKeyToRedis end');
}

exports.retrieveSessionIDFromUserKey = function (user_key, callback){

    console.log('into retrieveSessionIDFromUserKey. user_key: ' + user_key);

    //var client = redis.createClient(config.port, config.host, config.password);
    var client = redis.createClient(config.port, config.host);

    client.get(user_key, function (err, reply) {
        if(err)
            throw new Error('error retrieving session id from user key' + err);

        if(reply !== null && reply !== 'undefined'){
            console.log(reply.toString());
            callback(reply);
        }else{
            console.log('no habia respuesta para el id: ');
            console.log(reply.toString());
            return null;
        }

//        return reply;
    });

    client.end();
    console.log('into retrieveSessionIDFromUserKey end');
}

exports.retrieveSessionFromKey = function (session_key){

    console.log('into retrieveSessionFromKey. session_key: ' + session_key);

    //var client = redis.createClient(config.port, config.host, config.password);
    var client = redis.createClient(config.port, config.host);
    client.select(1);
    client.get('sess:'+session_key, function (err, reply2){
                    console.log('ya dentro del segundo get');
                    if(err)
                        throw new Error('error retrieving session from user key' + err);

                    if(reply2 !== null && reply2 !== 'undefined'){
                                console.log(reply2.toString());
                                return reply2;
                    } else {
                        console.log('no habia respuesta: ');
                        console.log(reply2.toString());
                        return null;
                    }
                });

    client.end();
    console.log('into retrieveSessionFromKey. end');
}


exports.alreadyExistentFromUserKey = function (req){

    console.log('into alreadyExistentFromUserKey. req.params.user_id: ' + req.params.user_id);

    //var client = redis.createClient(config.port, config.host, config.password);
    var client = redis.createClient(config.port, config.host);

    client.exists(req.params.user_id, function(err, reply) {
        if (reply === 1) {
            console.log('exists');
            throw new Error('Session for user already existed!');
        } else {
            console.log('doesn\'t exist');
        }
    });
    client.end();
}


function createRedisProfile (req, social_info){
    console.log('into createRedisProfile');
    req.session.user_id = req.params.user_id;
    req.session.social_profile = social_info;

    console.log('req.session.user_id:' + req.session.user_id);
    console.log('req.session.social_profile:' + req.session.social_profile);
    console.log('req.session:' + req.session);
    if(req.session.id === 'undefined')
       throw new Error('Error retrieving express session id');

    saveUserKeyToRedis(req.params.user_id, req.session.id);
    //EN BASE A ESTO VAMOS A PODER OBTENER LA SESION DE UN USUARIO Y ALTERARLA PARA AGREGAR NOTIFICACIONES QUE DEBE RECIVIR.
}
