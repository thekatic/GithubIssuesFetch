This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).<br>
[React Apollo](https://github.com/apollographql/react-apollo) was used to fetch data from GitHub via [GitHub GraphQL API](https://developer.github.com/v4/)

## Project includes

Tableview of issues listed in the [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow/issues) github repository, by default, with basic look and feel.

- [x] Sorting by supported fields
- [x] Pagination
- [x] Support changing the repository
- [x] OAuth authentication

## Run

Basic, without additional configuration

```sh
npm install
npm start
```

## Resources

Similar project:

* [GitHub-GraphQL-API-Example](https://github.com/apollographql/GitHub-GraphQL-API-Example) This is a small app to demonstrate how to load and paginate some issues and comments from a repository, using Apollo Client with React Native..
* [react-apollo-graphql-github-example](https://github.com/katopz/react-apollo-graphql-github-example) Apollo React example for Github GraphQL API with create-react-app.

## Notes and future improvements

* Used purely documented react-apollo v2.0.0 with migration [notes](https://github.com/apollographql/apollo-client/blob/master/docs/source/2.0-migration.md)
* Pager is implemented instead of pagination, due to GitHub GraphQl API v4 only supports cursor-based paging
* Once issues are sorted, going a next page will throw <br>
`Something went wrong while executing your query. This is most likely a GitHub bug. Please include 98CE:3572:2CB66E8:53D56E4:59F596F0 when reporting this issue.`
