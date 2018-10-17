import React, { Component } from 'react';
import axios from 'axios';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: 'bearer 0b8a21735b19b62babac96264c02458da45c0ae4',
  },
});

const getSearchQuery = (query) =>` { search(query: " ${ query } ", type: REPOSITORY, first: 10) {
  repositoryCount
    edges {
      node {
        ... on Repository {
          id
          nameWithOwner
          url
					tags:refs(refPrefix:"refs/tags/", last:1) {
            edges {
              tag:node {
                name
              }
            }
          }
          primaryLanguage {
            name
          }
        }
      }
    }
  }
}`

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }
  componentDidMount() {
    this.onFetchFromGitHub();
  }
  handleChange = (event) => {
    if(event.target.value !== "") {
      this.setState({ query: event.target.value }, this.HandleSubmit);
    } else {
      this.props.handleDataUpdate([]);
    }

  };
  handleSubmit = (event) => {
    this.onFetchFromGitHub(this.state.query);
    event.preventDefault();
  };
  onFetchFromGitHub = () => {
    axiosGitHubGraphQL
      .post('', { query: getSearchQuery(this.state.query) })
      .then(response => {
        if(response.data !== null) {
          this.props.handleDataUpdate(response.data.data.search.edges);
        }
      })
  };
	render() {
		return (
      <form className="search-wrapper" onSubmit={this.handleSubmit}>
        <input className="search-input"
          type="text"
          name="search"
          placeholder="Find repositories..."
          value={this.state.value}
          onKeyPress={this._handleKeyPress}
          onChange={this.handleChange}
          required/>
          <button className="search">Search</button>
      </form>
		)
	}
}

export default Search;
