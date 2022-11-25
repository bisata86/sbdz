
var express = require('express');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/', {
    maxage: process.env.NODE_ENV == "production" ? '0d' : '0d'
})) 
app.get('/', function(req, res) {
   res.sendfile('index.html');
});
var games = [];
var cards = [
  {
    name:'No tobacco snake',
    hp: 3,
    atk: 3,
    src:'/imgs/notobaccosnake.png',
    type : ['duro'],
    descr :"Un serprente duro, odia chi vola",
    specials: {
      with:[
      ],
      active : {
        single:
        [
        ],
        group:
        [
          {
            target:'fly',
            atk:2
          }
        ]
      }
    }
  },
  {
    name:'Il bastardissimo col naso che becca',
    hp: 3,
    atk: 3,
    src:'/imgs/ilbastardissimocolnasochebecca.png',
    type : ['negro'],
    specials: {
      with:[
      ],
      active : {
        single:
        [
        ],
        group:
        [
          {
            target:'all',
            atk:2
          }
        ]
      }
    }
  },
  {
    name:'Busto di gialina',
    hp: 3,
    atk: 3,
    src:'/imgs/bustodigialina.png',
    type : ['fly'],
    specials: {
      with:[
        {
          target:'Gialina senza busto',
          atk:10
        }
      ],
      active : {
        single:
        [
        ],
        group:
        [
           {
            target:'fly',
            atk:1
          }
        ]
      }
    }
  },
  {
    name:'La pantiana',
    hp: 4,
    atk: 3,
    src:'/imgs/lapantiana.png',
    type:['smelly'],
    specials: {
      with:[
      ],
      active : {
        single:
        [
        ],
        group:
        [
           {
            target:'negro',
            atk:2
          }
        ]
      }
    }
  },
  {
    name:'Chel dal formadi',
    hp: 4,
    atk: 5,
    src:'/imgs/cheldalformadi.png',
    type:['normal'],
    specials: {
      active : {
        single:
        [
          {
            target:'La pantiana',
            atk:10
          }
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Il cian di demonte',
    hp: 1,
    atk: 0,
    src:'/imgs/ilciandidemonte.png',
    type:['normal'],
    descr:"Ce l'ha con tutti e con nessuno",
    specials: {
      active : {
        single:
        [
          
        ],
        group:
        [
        {
          target:'all',
          atk:+1
        }
        ]
      }
    }
  },
  {
    name:'Il gufo oscuro',
    hp: 5,
    atk: 4,
    src:'/imgs/ilgufooscuro.png',
    type:['fly'],
    specials: {
      active : {
        single:
        [
          {
            target:'Il topazzo scassacazzo',
            atk:+10
          }
        ],
        group:
        [
        ]
      }
    }
  },
  {
    name:'Il topazzo scassacazzo',
    hp: 3,
    atk: 4,
    src:'/imgs/iltopazzoscassacazzo.png',
    type:['vecchio'],
    specials: {
      active : {
        single:
        [
          
        ],
        group:
        [
          {
            target:'fly',
            atk:10
          }
        ]
      },
    }
  },
  {
    name:'La fecciona putrefatta',
    hp: 9,
    atk: 0,
    src:'/imgs/lafeccionaputrefatta.png',
    descr:"con le sue misere forze si spara fuori e va contro ai tuoi problemi parandoti il culo",
    type:['smelly'],
    specials: {
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Capo del K.K.K',
    hp: 9,
    atk: 0,
    src:'/imgs/capodelkkk.png',
    descr:"Odia i negri",
    type:['norm'],
    specials: {
      active : {
        single:
        [
        ],
        group:
        [
          {
            target:'negro',
            atk:5
          }
        ]
      },
    }
  },
  {name:'Il cubo pieno di chiappe',
    hp: 3,
    atk: 3,
    src:'/imgs/ilcubopienodichiappe.png',
    type:['smelly'],
    specials: {
      active : {
        single:
        [
        ],
        group:
        [
        {
            target:'smelly',
            atk:5
          }
        ]
      },
      passive : {
        single:
        [
        ],
        group:
        [
        ]
      },

    }
  },
  {name:'Alfonso',
    hp: 4,
    atk: 3,
    src:'/imgs/alfonsolostronso.png',
    descr: 'Confonde le idee cambiando le carte in tavola',
    type:['norm'],
    specials: {
      active : {
        single:
        [
        ],
        group:
        [
        ]
      }
    }
  },
  {name:'Uselat mat',
    hp: 4,
    atk: 3,
    src:'/imgs/uselatmat.png',
    descr: 'Pippa',
    type:['fly'],
    specials: {
      active : {
        single:
        [
        {
            target:'Buaaah',
            atk:15
          }
        ],
        group:
        [
        ]
      }
    }
  },
  { 
    name:'Uomo astemio che beve a manetta',
    hp: 5,
    atk: 4,
    src:'/imgs/uomoastemiochebeveamanetta.png',
    type:['negro'],
    descr: 'E\' potentissimo e ha le chiappe al vento',
    specials: {
      active : {
        single:
        [
        ],
        group:
        [
        ]
      }
    }
  },
  { 
    name:'Dradagiaaaah',
    hp: 2,
    atk: 2,
    src:'/imgs/dradagiaaaah.png',
    type:['vecchio'],
    descr: '',
    specials: {
      active : {
        single:
        [
        ],
        group:
        [
        ]
      }
    }
  },
  { 
    name:'Liquame e putrefazione',
    hp: 2,
    atk: 2,
    src:'/imgs/liquameeputrefazione.png',
    type:['smelly'],
    descr: '',
    specials: {
      active : {
        with:[
        {
            target:'Merda e liquame',
            atk:5
          }
        ],
        single:
        [

        ],
        group:
        [
        {
            target:'smelly',
            atk:1
          }
        ]
      }
    }
  },
  { 
    name:'Il bagigi incazzoso',
    hp: 3,
    atk: 3,
    src:'/imgs/ilbagigiincazzoso.png',
    type:['vecchio'],
    descr: 'E\' un bagigi vecchio...',
    specials: {
      active : {
        with:[
        ],
        single:
        [
        ],
        group:
        [
        ]
      }
    }
  },
  { 
    name:'Il pachet di sigaretis che vuole i tuoi soldi',
    hp: 3,
    atk: 2,
    src:'/imgs/ilpachetdisigaretischevuoleituoisoldi.png',
    type:['norm'],
    descr: '',
    specials: {
      active : {
        with:[
        ],
        single:
        [
        ],
        group:
        [
        ]
      }
    }
  },
  { 
    name:'Terrone fellone',
    hp: 4,
    atk: 1,
    src:'/imgs/terronefellone.png',
    type:['norm'],
    descr: 'Non ha voglia di fare un cazzo',
    specials: {
      active : {
        with:[
        ],
        single:
        [
        ],
        group:
        [
        ]
      }
    }
  },
  { 
    name:'Il diavolo',
    hp: 3,
    atk: 2,
    src:'/imgs/ildiavolo.png',
    type:['norm'],
    descr: 'Il diavolo in persona',
    specials: {
      active : {
        with:[
        {
            target:'Merda e liquame',
            atk:15
          }
        ],
        single:
        [
        ],
        group:
        [
        ]
      }
    }
  },
  {name:'Merda e liquame',
    hp: 1,
    atk: 0,
    src:'/imgs/merdaeliquame.png',
    specials: {
      with: [
          {
            target:'all',
            atk:1
          },
          {
            target:'Chiappe infernali',
            atk:3
          }
      ],
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Il gufo che ha paura dei vecchi',
    hp: 3,
    atk: 4,
    src:'/imgs/ilgufochehapauradeivecchi.png',
    type:['fly'],
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
          {
            target:'vecchio',
            atk:-10
          }        ]
      },
    }
  },
  {
    name:'Il maruchin distrattore salamitico',
    hp: 2,
    atk: 2,
    src:'/imgs/ilmaruchindistrattoresalamitico.png',
    type:['normal'],
    descr:'Vuole venderti cose',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Il seccatore salsiccioso',
    hp: 3,
    atk: 1,
    src:'/imgs/ilseccatoresalsiccioso.png',
    type:['normal'],
    descr:'Prende tutti a salsicciate',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        {
            target:'all',
            atk:1
          }
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Edward faccia di merda',
    hp: 3,
    atk: 3,
    src:'/imgs/edward.jpg',
    descr: '',
    type:[],
    specials: {
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
      passive : {
        single:
        [
        ],
        group:
        [
        ]
      },

    }
  },
  {
    name:'Madracula',
    hp: 3,
    atk: 3,
    src:'/imgs/edward.jpg',
    descr: '',
    type:[],
    specials: {
      active : {
        single:
        [
          
        ],
        group:
        [
        ]
      },
      passive : {
        single:
        [
        ],
        group:
        [
        ]
      },

    }
  },
  {
    name:'La bestiacca intabarada e malvagia',
    hp: 3,
    atk: 3,
    src:'/imgs/labestiaccaintabaradaemalvagia.png',
    descr: 'Fa paura come una bastarda a Madracula e siccome è intabarada non teme i pessimi odori',
    type:['fly'],
    specials: {
      active : {
        single:
        [
          {
            target:'Madracula',
            atk:10
          },
        ],
        group:
        [
        ]
      },
      passive : {
        single:
        [
        ],
        group:
        [
          {
            target:'smelly',
            atk:+100
          }
        ]
      },

    }
  },
  {
    name:'Bisata piena e assonnata',
    hp: 3,
    atk: 1,
    src:'/imgs/bisatapienaeassonnata.png',
    type:['vecchio'],
    descr:'Ti rutta in faccia',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Il conigliazzo che si crede potente',
    hp: 1,
    atk: 2,
    src:'/imgs/ilconigliazzochesicredepotente.png',
    type:['smelly'],
    descr:'Al pusa',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Buaaah',
    hp: 4,
    atk: 5,
    src:'/imgs/buaaah.png',
    type:['normal'],
    descr:'Il migliore',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Il masurin sasin fellone',
    hp: 3,
    atk: 1,
    src:'/imgs/ilmasurinsasinfellone.png',
    type:['fly'],
    descr:'Culo e camicia col gufo oscuro',
    specials: {
      with: [
          {
            target:'Gufo oscuro',
            atk:5
          }
      ],
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Il giat che sbocca sempre',
    hp: 3,
    atk: 4,
    src:'/imgs/ilgiatchesboccasempre.png',
    type:['vecchio'],
    descr:'Gli fa tutto cagare, cè vomito dappertutto',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Uomo comunissimo con naso e orelis enormi',
    hp: 5,
    atk: 5,
    src:'/imgs/uomocomunissimoconnasoeorelisenormi.png',
    type:['norm'],
    descr:'Ha il naso e li orelis enormi',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'La sigaretta poderosa',
    hp: 3,
    atk: 3,
    src:'/imgs/lasigarettapoderosa.png',
    type:['norm'],
    descr:'Ha paura dell\'impiante inferocito',
    specials: {
      with: [
      ],
      active : {
        single:
        [
          {
            target:'Impiante inferocito',
            atk:-5
          }
        ],
        group:
        [
        ]
      },
    }
  },
  {
    name:'Lupo mannaro in fin di vita',
    hp: 1,
    atk: 1,
    src:'/imgs/lupomannaroinfindivita.png',
    type:['norm'],
    descr:'E\' in fin di vita',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
          {
            target:'all',
            atk:1
          }
        ]
      },
    }
  },
  {
    name:'Il fantasma formerdaccia',
    hp: 2,
    atk: 3,
    src:'/imgs/ilfantasmaformerdaccia.png',
    type:['norm'],
    descr:'Non ha paura di niente',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
          {
            target:'all',
            atk:1
          }
        ]
      },
    }
  },
  {
    name:'Il piede con le chiappe',
    hp: 3,
    atk: 4,
    src:'/imgs/ilpiedeconlechiappe.png',
    type:['negro'],
    descr:'Ti caga nei piedi',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
          {
            target:'negro',
            atk:5
          }
        ]
      },
    }
  },
  {
    name:'Il rospazzo con la bocca enorme',
    hp: 2,
    atk: 4,
    src:'/imgs/ilrospazzoconlaboccaenorme.png',
    type:['negro'],
    descr:'Vuole morire',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
          {
            target:'fly',
            atk:5
          }
        ]
      },
    }
  },
  {
    name:'Bala piena di lingua',
    hp: 5,
    atk: 2,
    src:'/imgs/balapienadilingua.png',
    type:['negro'],
    descr:'mah..',
    specials: {
      with: [
      ],
      active : {
        single:
        [
          {
            target:'Vacia spudacia',
            atk:5
          }
        ],
        group:
        [
          {
            target:'fly',
            atk:5
          }
        ]
      },
    }
  },
  {
    name:'Ketchappo tomatone',
    hp: 0,
    atk: 60,
    src:'/imgs/ketchappotomatone.png',
    type:['negro'],
    descr:'Fortissimo ma muore subito',
    specials: {
      with: [
      ],
      active : {
        single:
        [
        ],
        group:
        [
          {
            target:'negro',
            atk:5
          }
        ]
      },
    }
  },
  ]


for (var i = 0; i < cards.length; i++) {
  for (var k = 0; k < cards.length; k++) {
      if(cards[k].specials && cards[k].specials.active) {
        if(cards[k].specials.active.single) {
          for (var  l = 0; l < cards[k].specials.active.single.length; l++) {
            if(cards[k].specials.active.single[l].target==cards[i].name) {
               if(true) {
                  if(!cards[i].specials.passive) {
                    cards[i].specials.passive = {
                      single:[],
                      group:[]
                    }
                  }
                  cards[i].specials.passive.single.push({
                    target:cards[k].name,
                    atk:-cards[k].specials.active.single[l].atk
                  })
               }
            }
          }
        }
      }
  }
  cards[i].menu = []
}
var users = [];
var initCards = 4;
var playerMoves = 4

io.on('connection', (socket) => {
  users.push(socket.id)
  io.emit('countUsers',users.length);
  socket.on('ready', function (data) {
      console.log(games)
      socket.emit('listgames',games);
  });
  socket.on('newgame', function (data) {
      var g = {
          id:data.name+'_game_'+Math.floor((Math.random()*1000)+1),
          players:[
            {
              id:socket.id,
              name:data.name,
              ready:false,
              cards:[],
              tablecards:[],
              hp:50,
              atk:0,
              cardDim:0
            }
          ],
          status:'pending'}
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
          atk:0,
          cardDim:0
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
          clearSendGame(g)
        }

        io.emit('listgames',games);

      }
  });

  socket.on('getcard', function (data) {
      var g = findGameByPlayer(socket.id)
      if(g) {
        if(g.game.cards.length) {
          for (var i = 0; i < g.game.players.length; i++) {
            if(socket.id==g.game.players[i].id) { 
              if(g.game.players[g.game.turn].id==socket.id) {
                if(g.game.players[i].moves<=0) {
                  socket.emit('notify',{text:'No nore moves'})
                  return false
                }
                g.game.players[i].moves--
                g.game.players[i].cards.push(g.game.cards[0]);
                g.game.cards.splice(0,1)
              } else {
                socket.emit('notify',{text:'Not your turn'})
              }
            } else {
              //
            }
          }
        } else {
          socket.emit('notify',{text:'No more cards'})
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
            //controllare che sia il mio turno
            g.game.players[i].moves = playerMoves
            g.game.turn++
            g.game.turn = g.game.turn%g.game.players.length
          }

        }
        clearSendGame(g)
      }
  });
  socket.on('action', function (data) {
      var g = findGameByPlayer(socket.id)
      if(g) {
        if(data.action=='totable') {
          for (var i = g.game.players.length - 1; i >= 0; i--) {
            if(g.game.players[i].id==socket.id) {
              if(g.game.players[g.game.turn].id==socket.id) {
                if(g.game.players[i].moves<=0) {
                  socket.emit('notify',{text:'No nore moves'})
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
                let ggg = g.game.players[i]
                if(data.card.type && data.card.type.indexOf('instant')!=-1) {
                  setTimeout(function(){
                    console.log('gestire istantanea')
                    ggg.tablecards.pop();
                    clearSendGame(g)
                  },1000)
                }


              } else {
                socket.emit('notify',{text:'Not your turn'})
              }
            }
          }
        }
        if(data.action=='tohand') {
          for (var i = g.game.players.length - 1; i >= 0; i--) {
            if(g.game.players[i].id==socket.id) {
              if(g.game.players[g.game.turn].id==socket.id) {
                if(g.game.players[i].moves<=0) {
                  socket.emit('notify',{text:'No more moves'})
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
                socket.emit('notify',{text:'Not your turn'})
              }
            } else {
              //socket.emit('notify',{text:'Not your turn'})
            }
          }
          
        }

        clearSendGame(g)


      }
  });
  socket.on('attack', function (data) {
      io.to(socket.id).emit('console','attacker')
      io.to(data.id).emit('console','attacked')
      var g = findGameByPlayer(socket.id)
      if(g) {
        var targetTowers;
        var totalDefender = 0
        for (var i = 0; i < g.game.players.length; i++) {
          if(data.id==g.game.players[i].id) {
            totalDefender = g.game.players[i].hp
            targetTowers = g.game.players[i].tablecards
          }
        }
        console.log('targetTowers')
        console.log(targetTowers)
        console.log('---------')
        for (var i = 0; i < g.game.players.length; i++) {
          if(socket.id==g.game.players[i].id) {
            if(g.game.players[i].moves<=0) {
              socket.emit('notify',{text:'No nore moves'})
            } else {

              var amountAttack = 0;
              var descrAttack = [];
              console.log(g.game.players[i].tablecards)
              for (var  n = 0; n <g.game.players[i].tablecards.length; n++) {
                console.log(g.game.players[i].tablecards[n])
                var ctc = g.game.players[i].tablecards[n];
                if(!ctc.dead) {
                  amountAttack+=ctc.atk
                  descrAttack.push(ctc.atk+' from '+ctc.name)
                  for (var k = 0; k < ctc.specials.active.single.length; k++) {
                    var aattker = ctc.specials.active.single[k]
                    for (var p = 0; p < targetTowers.length; p++) {
                      if(targetTowers[p].name==aattker.target) {
                        amountAttack+=aattker.atk
                        descrAttack.push((aattker.atk>0?'+':'')+aattker.atk+' from '+ ctc.name)
                      }
                    }
                  }
                  for (var k = 0; k < ctc.specials.active.group.length; k++) {
                    var aattker = ctc.specials.active.group[k]
                    for (var p = 0; p < targetTowers.length; p++) {
                      if(aattker.target == 'all') {
                        amountAttack+=aattker.atk
                        descrAttack.push((aattker.atk>0?'+':'')+aattker.atk+' from '+ctc.name)
                      }
                      else if(targetTowers[p].type.indexOf(aattker.target)!=-1) {
                        amountAttack+=aattker.atk
                        descrAttack.push((aattker.atk>0?'+':'')+aattker.atk+' from '+ctc.name+'('+targetTowers[p].name+' is '+targetTowers[p].type+')')
                      }
                    }
                  }
                }
              }


              for (var p = 0; p < targetTowers.length; p++) {
                if(!targetTowers[p].dead) {
                  totalDefender+=targetTowers[p].hp
                }
               
              }

              if(totalDefender>amountAttack) {
                console.log(totalDefender,amountAttack)
                for (var cc = g.game.players.length - 1; cc >= 0; cc--) {
                  if(g.game.players[cc].id==socket.id) {
                    g.game.players[cc].moves--;
                  }
                }
                g.game.attack = {
                  from:socket.id,
                  to:data.id,
                  amount:amountAttack,
                  descr:descrAttack,
                  amounttemp:0,
                  amounttempdefenders:0
                }
              } else {
                g.game.players[i].dead = true;
                g.game.players[i].hp = -1; // 11
                for (var cc = g.game.players.length - 1; cc >= 0; cc--) {
                   io.to(g.game.players[cc].id).emit('notify',{text:g.game.players[i].name+' is dead'})
                }
              }
            }
          }
        }
        clearSendGame(g)
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
                    if(g.game.players[i].tablecards[p].hp<=0) {
                      g.game.players[i].tablecards[p].dead = true
                      for (var cc = g.game.players.length - 1; cc >= 0; cc--) {
                         io.to(g.game.players[cc].id).emit('notify',{text:g.game.players[i].tablecards[p].name+' is dead'})
                      }
                      g.game.players[i].atk-=g.game.players[i].tablecards[p].atk
                    }
                  }
                }

            } else {
            }
          }
          delete g.game.attack
        } else {
          var defName = "";
          for (var i = g.game.players.length - 1; i >= 0; i--) {
             if(g.game.players[i].id==g.game.attack.to) {
               defName = g.game.players[i].name
             }
          }
          for (var i = g.game.players.length - 1; i >= 0; i--) {
             io.to(g.game.players[i].id).emit('notify',{text:defName+' defence failure'})
          }
          
        }
        clearSendGame(g)
        //delete g.game.attack.message
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

  function clearSendGame(g) {
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