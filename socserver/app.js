const DataTimeout = 5; // в секундах

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

var graphql = require('graphql').graphql;
var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLFloat = require('graphql').GraphQLFloat;
var GraphQLObjectType = require('graphql').GraphQLObjectType;

var query = '{GoodsID, Price1, Price2, Price3}';

var prices = [];

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'News',
    fields: {
      GoodsID: {
        type: GraphQLString,
        resolve() {
          return '42';
        }
      },
      Price1: {
        type: GraphQLFloat,
        resolve() {
          return prices[0];
        }
      },
      Price2: {
        type: GraphQLFloat,
        resolve() {
          return prices[1];
        }
      },
      Price3: {
        type: GraphQLFloat,
        resolve() {
          return prices[2];
        }
      }
    }
  })
});

var OldData = {};
console.log('Started');


io.on('connection', function (socket) {
  DataFormation();
  
  if (!timerId) {
    var timerId = setInterval(() => DataFormation(), DataTimeout * 1000);
  }

  function DataFormation() {
    prices[0] = (Math.random() * 100).toFixed(2);
    prices[1] = (Math.random() * 100).toFixed(2);
    prices[2] = (Math.random() * 100).toFixed(2);
    graphql(schema, query).then(result => {
      for (var key in result.data) {
        if ((OldData[key] === result.data[key]) && (key !== 'GoodsID')) {
          delete (result.data[key]);
        }
      }
      socket.emit('news', result);
      console.log(result);
      OldData = result.data;
    })
  }

});
