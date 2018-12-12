const WebSocket = require('ws');
const log = require('../utils/log');
const MessageInit = require("./MessageInit.js")
// var server_manager = require('./socket/server_manager.js');

var global_session_list = {};
var global_seesion_key = 1;

var socketClass ={
    start_ws_server:start_ws_server,  
    ws_add_client_session_event:ws_add_client_session_event,
    register_serivces_handler:register_serivces_handler,
    dispatchEvent:dispatchEvent
}


var table={}
table.nums = function(t){
    let count = 0
    for (const key in t) {
        count = count + 1
    }
    return count
}


// 发送命令
function session_send_encoded_cmd(cmd) {
    if (!this.is_connected) {
        return;
    }
    cmd = JSON.stringify(cmd) 
    if(this.readyState == WebSocket.OPEN){
        this.send(cmd);
    }

    
}
 
// 有客户端的session接入进来
function on_session_enter(session) {
    // if (is_ws) {
        log.info("session enter", session._socket.remoteAddress, session._socket.remotePort);
    // }
    // else {
    //     log.info("session enter", session.remoteAddress, session.remotePort);   
    // }
    
    session.last_pkg = null; // 表示我们存储的上一次没有处理完的TCP包;
    
    session.is_connected = true;

    // 扩展session的方法
    session.send_encoded_cmd = session_send_encoded_cmd;

    global_session_list[global_seesion_key] = session;
    session.session_key = global_seesion_key;
    global_seesion_key ++;
}

function on_session_exit(session) {
    session.is_connected = false;
    socketClass.dispatchEvent(session,MessageInit.DisConnection); 

    session.last_pkg = null; 
    if (global_session_list[session.session_key]) {
        global_session_list[session.session_key] = null;
        delete global_session_list[session.session_key]; // 把这个key, value从 {}里面删除
        session.session_key = null;
    }
}

function ws_add_client_session_event(session) {
    // close事件
    session.on("close", function() {
        on_session_exit(session);
        session.close();
    });

    // error事件
    session.on("error", function(err) {
    });
    // end 

    session.on("message", function(data) { 
        data = JSON.parse(data) 
        socketClass.dispatchEvent(session,data.m_msgId,data); 
    }.bind(this));

    on_session_enter(session, true); 
}

function start_ws_server(ip, port) {
    log.info("start server IP:",ip,"port:",port)
    const server = new WebSocket.Server({
        host:ip,
        port:port,
    });

    function on_server_client_comming (client_sock) {
        ws_add_client_session_event(client_sock);
    }
    server.on("connection", on_server_client_comming);

    function on_server_listen_error(err) {
        log.error("ws server listen error!!");
    }
    server.on("error", on_server_listen_error);

    function on_server_listen_close(err) {
        log.error("ws server listen close!!");
    }
    server.on("close", on_server_listen_close);
}
 


var serivces_handler =  {}
function register_serivces_handler(eventType, method) {
    if(!eventType || !method) return
    let methods = serivces_handler[eventType];
    if(!methods){
        serivces_handler[eventType] = {}
        methods= serivces_handler[eventType]
    }

    for (const key in methods) {
        let storemethod = methods[key]
        if(storemethod==method){
            log.warn("eventID conflict please reset")
            return 
        }
    }    
    methods[table.nums(methods)+1] = method
}

function dispatchEvent(session, eventType, ...param){
    if (!eventType) return
    let methods = serivces_handler[eventType] || {}
    for (const key in methods) {
        let method = methods[key]
        if(method){
            method(session,...param)
        }
    } 
}

// function board(){
//     if(wss){
//         wss.clients.forEach(function(client){
//             client.readyState
//             client.send("广播")
//         })
//     }
// }

module.exports= socketClass
