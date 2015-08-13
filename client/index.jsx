import React               from 'react';
import { Router }          from 'react-router';
import { history }         from 'react-router/lib/BrowserHistory';
import { Provider }        from 'react-redux';
// import { fromJS }          from 'immutable';
import * as reducers       from '../shared/reducers';
import routes              from '../shared/routes';
import promiseMiddleware   from '../shared/lib/promiseMiddleware';
import immutifyState       from '../shared/lib/immutifyState';
import { createStore,
         combineReducers,
         applyMiddleware } from 'redux';

const initialState = immutifyState(window.__INITIAL_STATE__);

const reducer = combineReducers(reducers);
const store   = applyMiddleware(promiseMiddleware)(createStore)(reducer, initialState);

React.render(
  <Provider store={store}>
    {() =>
      <Router children={routes} history={history} />
    }
  </Provider>,
  document.getElementById('react-view')
);
