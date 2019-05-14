import React from 'react';
import ReactDOM from 'react-dom';
import "@babel/polyfill";
import App from './App/App';
import 'antd/dist/antd.min.css';
import './styles.scss';

ReactDOM.render(<App />, document.getElementById('app'));
