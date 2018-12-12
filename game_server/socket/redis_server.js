const redis = require("redis")
var log = require("../utils/log.js");

var RedisClient = null
var Redisserver={
    connectRedis:function(_port ,_ip,db_index){
        RedisClient = redis.createClient({
            port:_port ,
            db: db_index
        })

        RedisClient.on("error", function(err) {
            log.error(err);
        });
    },
 
    set_uinfo_inredis:function(uid, uinfo) {
        if (RedisClient === null) {
            return;
        }
        var key = "hero_game_user_uid_" + uid;  
        RedisClient.hmset(key, uinfo, function(err) {
            if(err) {
                log.error(err);
            }
        });
    },

    get_uinfo_inredis:function(uid, callback) {
        if (RedisClient === null) {
            return;
        }
        var key = "hero_game_user_uid_" + uid;
        RedisClient.hgetall(key, function(err, data) {
            if (err) {
                log.error(err);
                return;
            }
            var uinfo = data; 
            callback(uinfo);
        });
    }
}

module.exports= Redisserver