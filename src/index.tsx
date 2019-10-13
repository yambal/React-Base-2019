import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router'
import App from './App';
import * as serviceWorker from './serviceWorker';

/** Redux */
import { Provider } from 'react-redux'
import store, { history } from './redux/store'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>, document.getElementById('root')
);

serviceWorker.unregister();
