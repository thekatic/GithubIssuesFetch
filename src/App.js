import React, { Component } from 'react';
import { ApolloLink } from 'apollo-link';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import AlertContainer from 'react-alert';
import Cookies from 'universal-cookie';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';

// App.Components
import Issues from './components/issues';
import Login from './components/login';

const cache = new InMemoryCache();
const cookies = new Cookies();

// Global.Auth
let TOKEN = cookies.get('github_token');

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

const alertOptions = {
  position: 'bottom right',
  time: 10000
}

// App
class App extends Component {
  constructor () {
    super()
    this.state = { login: !!TOKEN }

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

  logged(token) {
    TOKEN = token
    cookies.set('github_token', token, { path: '/' });
    this.setState({ login: true })
  }

  render () {
    let page = null;
    let title = null;

    if (!this.state.login) {
      title = 'GitHub login'
      page = <Login callback={this.logged} />
    } else {
      title = 'Issues'
      page = <ApolloProvider client={client}>
          <Col md={12}>
            <Issues {...this.routeForIssues('tensorflow', 'tensorflow', 20)} />
          </Col>
        </ApolloProvider>
    }

    // Logged in, fetch from Github
    return <div>
      <AlertContainer ref={a => window.msg = a} {...alertOptions} />
      <PageHeader className="text-center">{title}</PageHeader>
      <Grid>
        <Row>
          {page}
        </Row>
      </Grid>
    </div>
  }
}

export default App;
