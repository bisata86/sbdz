
var express = require('express');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/', {
    maxage: process.env.NODE_ENV == "production" ? '0d' : '0d'
})) 
app.get('*', function(req, res) {
   res.sendfile('index.html');
});
var games = [];
var cards = [
  {
    name:'La gallina senza busto',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'Busto di gallina',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'Ladu',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'Lupo mannaro che si sega le gambe',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'Semensa',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {
    name:'Chiappe fiappe',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'Skifasterking',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'Alfonso',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'Edward faccia di merda',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'Rasquf il bastardo',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'aaaa',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'bbbbb',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },
  {name:'ccccc',
    hp: 10,
    atk: 10,
    def: 4,
    specials: {
      atk:[],
      def:[],
    }
  },

  ]
for (var i = 0; i < cards.length; i++) {
  cards[i].menu = []
}
var users = [];
var initCards = 2;
var playerMoves = 3

io.on('connection', (socket) => {
  users.push(socket.id)
  io.emit('countUsers',users.length);
  socket.on('ready', function (data) {
      console.log(games)
      socket.emit('listgames',games);
  });
  socket.on('newgame', function (data) {
      var g = {id:data.name+'_game',players:[{id:socket.id,name:data.name,ready:false,cards:[],
          tablecards:[],hp:50,
          atk:0}],status:'pending'}
      games.push(g)
      io.emit('listgames',games);
      socket.emit('status','gamesetup');
      socket.emit('updategame',g);
  });
  socket.on('send', function (data) {
      data.time = new Date().getTime()
      messages.push(data)
      var r = socket.handshake.headers.referer
      var room = 'all'
      if(r[r.length-1]!='/') {
        var u = r.split('/')
        room = u[u.length-1]
      }
      data.room = room
      io.to(room).emit('message',data);
  });
  socket.on('countUsers', function (data) {
      io.emit('countUsers',users.length);
  });
  socket.on('join', function (data) {
      socket.emit('status','gamesetup');
      var g = findGame(data.id)
      if(g) {
        g.game.players.push({
          id:socket.id,
          name:data.name,
          ready:false,
          cards:[],
          tablecards:[],
          hp:50,
          atk:0
        })
        for (var i = 0; i < g.game.players.length; i++) {
          io.to(g.game.players[i].id).emit('updategame',g.game)
        }
      }
      io.emit('listgames',games);
  });
  socket.on('updategame', function (data) {
      var g = findGameByPlayer(data.id)
      if(g) {
        var allready = true;
        for (var i = 0; i < g.game.players.length; i++) {
          if(socket.id==g.game.players[i].id && data.changeReady) g.game.players[i].ready=!g.game.players[i].ready 
          if(g.game.players[i].ready==false) allready = false
        }
        if(allready) {
          g.game.status = 'game'
          g.game.turn = 0;
          g.game.cards = JSON.parse(JSON.stringify(cards))
          g.game.cards.sort(() => Math.random() - 0.5)
          
          for (var i = 0; i < g.game.players.length; i++) {
            g.game.players[i].cards = []
            g.game.players[i].tablecards = []
            for (var m = 0; m < initCards; m++) {
              g.game.players[i].cards.push(g.game.cards[0])
              g.game.cards.splice(0,1)
            }
            //io.to(g.game.players[i].id).emit('updategame',g.game)
            //io.to(g.game.players[i].id).emit('status','game')
            // io.to(g.game.players[i].id).emit('message',{text:'Choose '+initCards+' cards to start the match with'})
          }
          for (var i = 0; i < g.game.players.length; i++) {
            g.game.players[i].atk = 0;
            g.game.players[i].moves = playerMoves
          }


          for (var i = 0; i < g.game.players.length; i++) {
            if(true) {
              g.game.players[i].tempcards = JSON.parse(JSON.stringify(g.game.players[i].cards))
              for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
                g.game.players[i].cards[v].name = ''
                g.game.players[i].cards[v].hp = ''
                g.game.players[i].cards[v].atk = ''
              }
            }
          }
          for (var i = 0; i < g.game.players.length; i++) { 
            g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
            io.to(g.game.players[i].id).emit('updategame',g.game)
            io.to(g.game.players[i].id).emit('status','game')
            for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
              g.game.players[i].cards[v].name = ''
              g.game.players[i].cards[v].hp = ''
              g.game.players[i].cards[v].atk = ''
            }
          }
          for (var i = 0; i < g.game.players.length; i++) {
            g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
            delete g.game.players[i].tempcards
          }

        } else {
          for (var i = 0; i < g.game.players.length; i++) {
            if(true) {
              g.game.players[i].tempcards = JSON.parse(JSON.stringify(g.game.players[i].cards))
              for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
                g.game.players[i].cards[v].name = ''
                g.game.players[i].cards[v].hp = ''
                g.game.players[i].cards[v].atk = ''
              }
            }
          }
          for (var i = 0; i < g.game.players.length; i++) { 
            g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
            io.to(g.game.players[i].id).emit('updategame',g.game)
            for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
              g.game.players[i].cards[v].name = ''
              g.game.players[i].cards[v].hp = ''
              g.game.players[i].cards[v].atk = ''
            }
          }
          for (var i = 0; i < g.game.players.length; i++) {
            g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
            delete g.game.players[i].tempcards
          }
        }

        io.emit('listgames',games);

      }
  });

  socket.on('getcard', function (data) {
      var g = findGameByPlayer(socket.id)
      if(g) {
        if(g.game.cards.length)
        for (var i = 0; i < g.game.players.length; i++) {
          if(socket.id==g.game.players[i].id) {
            if(g.game.players[i].moves<=0) {
              return false
            }
            g.game.players[i].moves--
            g.game.players[i].cards.push(g.game.cards[0]);
            g.game.cards.splice(0,1)
          }

        }
        for (var i = 0; i < g.game.players.length; i++) {
          if(true) {
            g.game.players[i].tempcards = JSON.parse(JSON.stringify(g.game.players[i].cards))
            for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
              g.game.players[i].cards[v].name = ''
              g.game.players[i].cards[v].hp = ''
              g.game.players[i].cards[v].atk = ''
            }
          }
        }
        for (var i = 0; i < g.game.players.length; i++) { 
          g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
          io.to(g.game.players[i].id).emit('updategame',g.game)
          for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
            g.game.players[i].cards[v].name = ''
            g.game.players[i].cards[v].hp = ''
            g.game.players[i].cards[v].atk = ''
          }
        }
        for (var i = 0; i < g.game.players.length; i++) {
          g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
          delete g.game.players[i].tempcards
        }
      }
  });
  socket.on('endturn', function (data) {
      var g = findGameByPlayer(socket.id)
      if(g) {
        for (var i = 0; i < g.game.players.length; i++) {
          if(socket.id==g.game.players[i].id) {
            //controllar eche sia il mio turno
            g.game.players[i].moves = playerMoves
            g.game.turn++
            g.game.turn = g.game.turn%g.game.players.length
          }

        }
        for (var i = 0; i < g.game.players.length; i++) {
          if(true) {
            g.game.players[i].tempcards = JSON.parse(JSON.stringify(g.game.players[i].cards))
            for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
              g.game.players[i].cards[v].name = ''
              g.game.players[i].cards[v].hp = ''
              g.game.players[i].cards[v].atk = ''
            }
          }
        }
        for (var i = 0; i < g.game.players.length; i++) { 
          g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
          io.to(g.game.players[i].id).emit('updategame',g.game)
          for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
            g.game.players[i].cards[v].name = ''
            g.game.players[i].cards[v].hp = ''
            g.game.players[i].cards[v].atk = ''
          }
        }
        for (var i = 0; i < g.game.players.length; i++) {
          g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
          delete g.game.players[i].tempcards
        }
      }
  });
  socket.on('action', function (data) {
      var g = findGameByPlayer(socket.id)
      if(g) {
        if(data.action=='totable') {
          for (var i = g.game.players.length - 1; i >= 0; i--) {
            if(g.game.players[i].id==socket.id) {
              if(g.game.players[i].moves<=0) {
                return false
              }
              var ncards = [];
              for (var b = g.game.players[i].cards.length - 1; b >= 0; b--) {
                if(g.game.players[i].cards[b].name!=data.card.name) {
                  ncards.push(g.game.players[i].cards[b])
                } 
              }
              g.game.players[i].cards = ncards
              g.game.players[i].atk += data.card.atk
              g.game.players[i].moves--
              g.game.players[i].tablecards.push(data.card)
            } else {
              //g.game.players[i].tempcards = JSON.parse(JSON.stringify(g.game.players[i].cards))
            }
          }
        }
        if(data.action=='tohand') {
          for (var i = g.game.players.length - 1; i >= 0; i--) {
            if(g.game.players[i].id==socket.id) {
              if(g.game.players[i].moves<=0) {
                return false
              }
              var ncards = [];
              for (var b = g.game.players[i].tablecards.length - 1; b >= 0; b--) {
                if(g.game.players[i].tablecards[b].name!=data.card.name) {
                  ncards.push(g.game.players[i].tablecards[b])
                } 
              }
              g.game.players[i].tablecards = ncards
              g.game.players[i].atk -= data.card.atk
              g.game.players[i].moves--
              g.game.players[i].cards.push(data.card)
            } else {
              //g.game.players[i].tempcards = JSON.parse(JSON.stringify(g.game.players[i].cards))
            }
          }
          
        }
        for (var i = 0; i < g.game.players.length; i++) {
          if(true) {
            g.game.players[i].tempcards = JSON.parse(JSON.stringify(g.game.players[i].cards))
            for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
              g.game.players[i].cards[v].name = ''
              g.game.players[i].cards[v].hp = ''
              g.game.players[i].cards[v].atk = ''
            }
          }
        }
        for (var i = 0; i < g.game.players.length; i++) { 
          g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
          io.to(g.game.players[i].id).emit('updategame',g.game)
          for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
            g.game.players[i].cards[v].name = ''
            g.game.players[i].cards[v].hp = ''
            g.game.players[i].cards[v].atk = ''
          }
        }
        for (var i = 0; i < g.game.players.length; i++) {
          g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
          delete g.game.players[i].tempcards
        }
      }
  });
  socket.on('attack', function (data) {
      io.to(socket.id).emit('console','attacker')
      io.to(data.id).emit('console','attacked')
      var g = findGameByPlayer(socket.id)
      if(g) {
        for (var i = 0; i < g.game.players.length; i++) {
          if(socket.id==g.game.players[i].id) {
            g.game.attack = {
              from:socket.id,
              to:data.id,
              amount:g.game.players[i].atk,
              amounttemp:0,
              amounttempdefenders:0
            }
          }
        }
        
        for (var i = 0; i < g.game.players.length; i++) {
            if(true) {
              g.game.players[i].tempcards = JSON.parse(JSON.stringify(g.game.players[i].cards))
              for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
                g.game.players[i].cards[v].name = ''
                g.game.players[i].cards[v].hp = ''
                g.game.players[i].cards[v].atk = ''
              }
            }
          }
        for (var i = 0; i < g.game.players.length; i++) { 
            g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
            io.to(g.game.players[i].id).emit('updategame',g.game)
            for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
              g.game.players[i].cards[v].name = ''
              g.game.players[i].cards[v].hp = ''
              g.game.players[i].cards[v].atk = ''
            }
          }
        for (var i = 0; i < g.game.players.length; i++) {
          g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
          delete g.game.players[i].tempcards
        }
      }
  });
  socket.on('handleattack', function (data) {
      var g = findGameByPlayer(socket.id)
      if(g) {
        if((data.attack.amounttemp+data.attack.amounttempdefenders)>=data.attack.amount) {
          for (var i = g.game.players.length - 1; i >= 0; i--) {
            if(g.game.players[i].id==g.game.attack.to) {
                g.game.players[i].hp -= data.attack.amounttemp

                for (var p = 0; p < data.players[i].tablecards.length; p++) {
                  if(data.players[i].tablecards[p].amounttemp) {
                    g.game.players[i].tablecards[p].hp -= data.players[i].tablecards[p].amounttemp
                    delete data.players[i].tablecards[p].amounttemp
                  }
                }

            } else {
            }
          }
          delete g.game.attack
        }
        for (var i = 0; i < g.game.players.length; i++) {
            if(true) {
              g.game.players[i].tempcards = JSON.parse(JSON.stringify(g.game.players[i].cards))
              for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
                g.game.players[i].cards[v].name = ''
                g.game.players[i].cards[v].hp = ''
                g.game.players[i].cards[v].atk = ''
              }
            }
          }
        for (var i = 0; i < g.game.players.length; i++) { 
            g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
            io.to(g.game.players[i].id).emit('updategame',g.game)
            for (var v = g.game.players[i].cards.length - 1; v >= 0; v--) {
              g.game.players[i].cards[v].name = ''
              g.game.players[i].cards[v].hp = ''
              g.game.players[i].cards[v].atk = ''
            }
          }
        for (var i = 0; i < g.game.players.length; i++) {
          g.game.players[i].cards = JSON.parse(JSON.stringify(g.game.players[i].tempcards))
          delete g.game.players[i].tempcards
        }
      }
      
      //io.to(data.id).emit('attack',{name:data.name,amount:data.atk})
  });
  socket.on('disconnect', function () {
      users.splice(users.indexOf(socket.id), 1); 

      var g = findGameByPlayer(socket.id)
      if(g) {
        var index;
        for (var i = 0; i < g.game.players.length; i++) {
          if(g.game.players[i].id==socket.id) index = i
          io.to(g.game.players[i].id).emit('console','qualcuno si è disconnesso')
        }
        g.game.players.splice(index,1)
        if(g.game.players.length==0) {
          g.game.status = 'canceled'
        }
        for (var i = 0; i < g.game.players.length; i++) {
          io.to(g.game.players[i].id).emit('updategame',g.game)
        }
        io.emit('listgames',games);
      }

  });
})
server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function roomFilter(messages,room) {
  var newMessages = [];
  for (var i = 0; i < messages.length; i++) {
    if(messages[i].room==room) {
      newMessages.push(messages[i])
    }
  }
  return newMessages;
}
function findGame(sid) {
    for (var i = 0; i < games.length; i++) {
        if(games[i].id==sid) {
            return {game:games[i],index:i};
        }
    }
    return false;
}
function findGameByPlayer(sid) {
    for (var i = 0; i < games.length; i++) {
        for (var ih = 0; ih < games[i].players.length; ih++) {
          if(games[i].players[ih].id==sid) {
              return {game:games[i],index:i};
          }
      }
    }
    return false;
}
function findUser(sid) {
    for (var i = 0; i < users.length; i++) {
        if(users[i]==sid) {
            return users[i];
        }
    }
    return false;
}