import React from 'react';
import ReactDOM from 'react-dom';
// Importamos CSS para el CONFIRM-ALERT
import 'react-confirm-alert/src/react-confirm-alert.css'
import './index.scss';
import App from './App';

import axios from 'axios';

axios.defaults.headers.common['Accept-Language'] = 'en';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
);