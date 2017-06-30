const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const io = require('socket.io')(server);

const index = require('./routes/index');
const users = require('./routes/users');


import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import Player from './server/player';

const convert = require('koa-convert');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);


app.use( convert(webpackDevMiddleware( compiler, {
	publicPath: webpackConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
})));

app.use( convert(webpackHotMiddleware( compiler ) ));

// error handler
onerror(app);

// middlewares
app.use(bodyparser);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

//socket
const SOCKET_LIST = {};

const initPack = { player:[] };
const removePack = { player:[] };

io.on('connection',function(socket){
	
	console.log('socket connection!');
	
	socket.id = Math.random();
	
	SOCKET_LIST[socket.id] = socket;
	
	socket.on('connect',function() {
		player = new Player(socket,initPack);
		player.onConnect(socket,player);
	});
	
	socket.on('disconnect',function(){
		
		delete SOCKET_LIST[socket.id];
		//player.onDisconnect(player,socket,removePack);
	});
	
});









// port
server.listen(3000);
module.exports = server;
