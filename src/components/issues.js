// React
import React from 'react';

// GraphQL
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Panel, Row, Col, Table, Pager } from 'react-bootstrap';
import Moment from 'react-moment';

import SortIssues from './sort';
import Repo from './repo';

const GetIssuesInfoQuery = gql`
  query GetRepositoryIssues($name: String!, $login: String!, $firstPerPage: Int, $lastPerPage: Int, $next: String, $prev: String, $orderBy: IssueOrderField = CREATED_AT, $direction: OrderDirection = DESC) {
    repositoryOwner(login: $login) {
      repository(name: $name) {
        issues(first: $firstPerPage, last: $lastPerPage, after: $next, before: $prev, orderBy: {field: $orderBy, direction: $direction}) {
          totalCount
          edges {
            node {
              id
              title
              state
              comments {
                totalCount
              }
              createdAt
              url
            }
          }
          pageInfo {
            startCursor
            hasPreviousPage
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const withInfo = graphql(GetIssuesInfoQuery, {
  options: ({ login, name, perPage }) => {
    return {
      variables: {
        login: login,
        name: name,
        firstPerPage: perPage
      }
    }
  },
  props: ({ data: { loading, error, repositoryOwner, variables, fetchMore } }) => {
    // loading state
    if (loading) {
      return { loading: true };
    }

    // error state
    if (error) {
      console.error(error);
    }

    // OK state
    return {
      repositoryOwner,
      error,
      goTo(nextPage) {
        const pageInfo = repositoryOwner.repository.issues.pageInfo;
        const vars = nextPage ? { firstPerPage: 20, lastPerPage: null, next: pageInfo.endCursor } : { lastPerPage: 20, firstPerPage: null, prev: pageInfo.startCursor };

        return fetchMore({
          variables: vars,
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult.repositoryOwner.repository) {
              return previousResult;
            }
            return fetchMoreResult;
          }
        })
      },
      sort(orderBy, direction) {
        variables.orderBy = orderBy;
        variables.direction = direction;

        return fetchMore({
          variables: variables,
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult.repositoryOwner.repository) {
              return previousResult;
            }
            return fetchMoreResult;
          }
        })
      },
      changeRepo(login, name) {
        variables.login = login;
        variables.name = name;

        return fetchMore({
          variables: variables,
          updateQuery: (previousResult, {fetchMoreResult}) => {
            if (!fetchMoreResult.repositoryOwner.repository) {
              return previousResult;
            }
            return fetchMoreResult;
          }
        })
      }
    };
  },
});

// Issues
class Issues extends React.Component {
  constructor(props) {
    super(props);

    // states
    this.state = {
      login: props.login,
      name: props.name,
      issues: [],
      totalCount: 0,
      perPage: props.perPage
    };
  }

  componentWillReceiveProps(newProps) {
    // DRY
    const repo = newProps.repositoryOwner.repository;
    // states
    this.setState({
      login: this.props.login,
      name: this.props.name,
      issues: repo.issues.edges,
      totalCount: repo.issues.totalCount,
      perPage: this.props.perPage,
      hasPrev: repo.issues.pageInfo.hasPreviousPage,
      hasNext: repo.issues.pageInfo.hasNextPage,
      goTo: newProps.goTo,
      sort: newProps.sort,
      changeRepo: newProps.changeRepo
    });
  }

  goto(next) {
    this.state.goTo(next).then(function(data){
      // do nothing
    }, function(error) {
      window.msg.error(error.message);
    });
  }

  render() {
    return (<Panel>
      <Row>
        <Col xs={12} sm={8}>
          <Repo login={this.state.login} name={this.state.name} changeRepo={this.state.changeRepo} />
        </Col>
        <Col xs={12} sm={4}>
          <SortIssues sort={this.state.sort} />
        </Col>
      </Row>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>State</th>
            <th>#Comments</th>
            <th className="col-date">Created at</th>
          </tr>
        </thead>
        <tbody>
          { this.state.issues.map(
            issue =>
              <tr key={issue.node.id}>
                <td><a href={issue.node.url} target="_blank">{issue.node.title}</a></td>
                <td>{issue.node.state}</td>
                <td>{issue.node.comments.totalCount}</td>
                <td>
                  <Moment format="YYYY/MM/DD HH:mm">
                    {issue.node.createdAt}
                  </Moment>
                </td>
              </tr>
            )
          }
        </tbody>
      </Table>
      <Pager>
        <Pager.Item previous disabled={!this.state.hasPrev} href="#" onClick={this.goto.bind(this, false)}>&larr; Previous</Pager.Item>
        <Pager.Item next disabled={!this.state.hasNext} href="#" onClick={this.goto.bind(this, true)}>Next &rarr;</Pager.Item>
      </Pager>
    </Panel>)
  }
}

const IssuesWithInfo = withInfo(Issues);
export default IssuesWithInfo;
