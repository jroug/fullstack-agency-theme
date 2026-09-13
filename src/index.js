import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import { createClient } from './services/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ApolloProvider client={createClient()}><App /></ApolloProvider>);
