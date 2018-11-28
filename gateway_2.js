const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const { Client, Server } = require('feathers-mq');

const app = express(feathers());

app.set('name', 'gateway');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());
app.configure(socketio());

//nats ning dapita
app.configure(Client({
  url:'192.168.43.189',
}));

//service ning dapita

class testService {
  create(data) {
    console.log(data);
    return data;
  }

  setup(app) {
    this.app = app;
  }
}

app.use('/tests', new testService())
app.use('/todos', app.service('microservice.todos'));

//channel ning dapita
app.publish(data => app.channel('everybody'));
app.on('connection', connection => app.channel('everybody').join(connection));

// instantiate server
app.listen(3031).on('listening', () =>
  console.log('Feathers server listening on localhost:3030')
);


//services ning dapita
const myTestService = app.service('tests');
myTestService.hooks({
  before:{
    all:[context => console.log('before :', context.method)]
  },
  after:{
    all:[context => console.log('after :', context.method)]
  },
  error:{
    all:[context => console.log('error :', context.error.message)]
  }
})

const todosService = app.service('todos');
todosService.hooks({
  before:{
    all:[context => console.log('before :', context.method)]
  },
  after:{
    all:[context => console.log('after :', context.method)]
  },
  error:{
    all:[context => console.log('error :', context.error.message)]
  }
})
