import React from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:3001/graphql',
  }),
});

function App() {

  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
