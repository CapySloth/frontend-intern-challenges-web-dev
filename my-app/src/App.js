import React, { Component } from 'react';
import './data-fetch.js';
import './reset.css';
import './App.css';

import axios from 'axios';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: 'bearer 07af01a5dd12614d1c7fecc18492a1d9ad2b5ea6',
  },
});

const getSearchQuery = (query) =>` { search(query: " ${ query } ", type: REPOSITORY, first: 10) {
  repositoryCount
    edges {
      node {
        ... on Repository {
          name
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

class Header extends Component {
	constructor(props) {
 		super(props);
		this.state = { title : "Title" };
	}
	render() {
		return <header title="My Github Favorites">
				<h1>My Github Favorites</h1>
			</header>
	}
}
class LeftPannel extends Component {
	render() {
		return (
			<div className="leftPannel">
				<Search/>
				<Repositories/>
			</div>
		)
	}
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      data : []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.onFetchFromGitHub();
  }

  handleChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSubmit = event => {
    this.onFetchFromGitHub(this.state.query);
    console.log(this.state.data)
    event.preventDefault();
  };

  onFetchFromGitHub = () => {
    axiosGitHubGraphQL
      .post('', { query: getSearchQuery(this.state.query) })
      .then(result =>
        this.setState(() => ({
          data: result.data.data.search.edges
        })),
      );
  };

	render() {
		return (
			<div>
				<form  className="search-wrapper">
					<input
          className="search-input"
          type="text"
          name="search"
          placeholder="Enter GitHub repository name"
          value={this.state.value} onChange={this.handleChange}/>
					<button type="button" onClick={this.handleSubmit} className="search">Search</button>
				</form>
			</div>
		)
	}
}
class Repositories extends Component {
	render() {
		return <Table/>
	}
}
class Table extends Component {
	render() {
		return (
			<div className="table-wrapper">
				<table>
          <tbody>
  					<tr>
  						<th>Name</th>
  						<th>Language</th>
  						<th>Latest tag</th>
  					</tr>
  					<Row/>
  					<Row/>
          </tbody>
				</table>
			</div>
		)
	}
}

class Row extends Component {
	render() {
		return (
			<tr>
				<td>Repo Name</td>
				<td>Liquid</td>
				<td>v1</td>
				<td className="edit-anchor"><RowMutationAnchor editType="Add"/></td>
			</tr>
		)
	}
}
class RowMutationAnchor extends Component {
	constructor(props) {
 		super(props);
		this.state = { editType : "Add" };
	}
	render() {
		return(
			<a href="#" href="javascript:void(0)"> { this.state.editType }</a>
		)
	}
}
class RightPannel extends Component {
	render() {
		return(
			<div className="rightPannel">
				<Favorites/>
			</div>
		)
	}
}
class Favorites extends Component {
	render() {
		return <Table/>
	}
}
class Content extends Component {
	render() {
		return(
			<div className="content">
				<LeftPannel/>
				<RightPannel/>
			</div>
		)
	}
}

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <Content/>
      </div>
    )
  }
}

export default App;
