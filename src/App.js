import React, { Component } from 'react';
import { ApolloLink } from 'apollo-link';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import AlertContainer from 'react-alert';
import { Col } from 'react-bootstrap';

// Auth
import { login } from './components/githubLogin';

// App.Components
import Issues from './components/issues';
import Login from './components/login';

const cache = new InMemoryCache();

// Global.Auth
let TOKEN = null;

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: `Bearer ${TOKEN}`
    }
  });
  return forward(operation)
});

// use with apollo-client
const link = middlewareLink.concat(httpLink);

const client = new ApolloClient({
  link: link,
  cache
});

// App
class App extends Component {
  constructor () {
    super()
    this.state = { login: false }

    this.logged = this.logged.bind(this)
  }

  routeForIssues (login, name, perPage) {
    return {
      title: `${login}/${name}`,
      component: Issues,
      login,
      name,
      perPage
    }
  }

  componentDidMount () {
    //
  }

  logged(token) {
    TOKEN = token
    this.setState({ login: true })
  }

  render () {
    // Log in state
    if (!this.state.login) {
      return <Login callback={this.logged} />
    }

    // Logged in, fetch from Github
    return <ApolloProvider client={client}>
        <Col md={12}>
          <AlertContainer ref={a => window.msg = a} />
          <Issues {...this.routeForIssues('tensorflow', 'tensorflow', 20)} />
        </Col>
      </ApolloProvider>
  }
}

export default App;
