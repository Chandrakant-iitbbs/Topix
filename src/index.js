import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './Redux/Store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="55303632954-ojdpep9p81c8j2623p0g4bmdu6jigtte.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
  </Provider>
);
reportWebVitals();
