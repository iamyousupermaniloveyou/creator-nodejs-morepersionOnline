// extend
require("./util/extend.js") 

//socket
const server_config = require("./socket/server_config.js")

const socketServer = require("./socket/socketServer.js")
socketServer.start_ws_server(server_config.LoginServer_Ip,server_config.LoginServer_Port)

//server
const login_server = require("./login/login_server.js")
login_server.register_serivces_handler()

const game_server = require("./game/game_server.js")
game_server.register_serivces_handler()

const redis_server = require("./socket/redis_server")
redis_server.connectRedis(server_config.redis_Ip,server_config.redis_Port,server_config.redisdb_index)

// //db
const Login_db = require("./database/Login_db.js")
Login_db.initWithConfig(server_config.DBip,server_config.DBport,server_config.DBuser,server_config.DBpword,server_config.DBname,server_config.DBisDebug)

const game_db = require("./database/game_db.js")
game_db.initWithConfig(server_config.DBip,server_config.DBport,server_config.DBuser,server_config.DBpword,server_config.DBname,server_config.DBisDebug)

var a = []
var b = new Array();
console.log(a.length,b.length)