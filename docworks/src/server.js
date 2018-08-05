import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import { renderToString } from 'react-dom/server'

import TodoStore from '../src/stores/TodoStore';
import ViewStore from '../src/stores/ViewStore';
import TodoApp from '../src/components/todoApp.js';
import App from '../src/apis/app';
import React from 'react';
import todoPage from './todoPage';
import apisPage from './apisPage';
import Page from './reference/page';

import {readFromDir} from 'docworks-repo';

const app = express();
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')))

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config');
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

let todos = []; // Todos are stored here

app.use(bodyParser.json());

app.get('/', function(req, res) {
  const todoStore = TodoStore.fromJS(todos);
  const viewStore = new ViewStore();

  const initView = renderToString((
    <TodoApp todoStore={todoStore} viewStore={viewStore} />
  ));

  const page = todoPage(todos, initView);

  res.status(200).send(page);
});

app.get('/api/apisPage', async function(req, res) {
  let services = await readFromDir('../../docs');
  console.log(services);
  const initView = renderToString((
    <App />
  ));

  const page = apisPage(todos, initView);

  res.status(200).send(page);
});

const parsePageName = /((([$\w]+)\/)*)([$\w]+).[$\w]+/;
app.get('/docs/*', async function(req, res) {
  let pageName = req.params[0];
  let repo = await readFromDir('public-docs');
  if (!pageName) {
    let index = repo.services.map(service => {
      if (service.memberOf)
        return `<a href="${service.memberOf}/${service.name}.html">${service.name}</a>`;
      else
        return `<a href="${service.name}.html">${service.name}</a>`;
    })
      .join('<br>');
    res.status(200).send(index);
  }
  else {
    let parsedPageName = parsePageName.exec(pageName);
    let serviceName = parsedPageName[4];
    let memberOf = (!!parsedPageName[1])?parsedPageName[1].slice(0, -1).replace(/\//g, '.'):undefined;
    let service = repo.services.find(_ => _.name === serviceName && _.memberOf === memberOf);

//    console.log(serviceName, memberOf, service);
    const page = Page(service);
    res.status(200).send(page);
  }
});

app.post('/api/todos', function(req, res) {
  todos = req.body.todos;
  if (Array.isArray(todos)) {
    console.log(`Updated todos (${todos.length})`);
    res.status(201).send(JSON.stringify({ success: true }));
  } else {
    res.status(200).send(JSON.stringify({ success: false, error: "expected `todos` to be array" }));
  }
});

app.get('*', function(req, res) {
  res.status(404).send('Server.js > 404 - Page Not Found');
});

app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);
  res.status(500).send("Server error");
});

process.on('uncaughtException', evt => {
  console.log('uncaughtException: ', evt);
});

app.listen(3000, function(){
  console.log('Listening on port 3000');
});
