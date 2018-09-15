import React, { Component } from 'react';
import './data-fetch.js';
import './reset.css';
import './App.css';

import axios from 'axios';
import PropTypes from 'prop-types';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: 'bearer e075f9f416c599f6ab13005888347dec89179719',
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
  constructor(){
  super();
  this.state= {
    data : []
    }
  }
  fromSearch(params) {
    if(params !== null) {
      this.setState({ data : params });
    }
  }
	render() {
		return (
			<div className="leftPannel">
				<Search callback={this.fromSearch.bind(this)}/>
				<Repositories data={this.state.data}/>
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
    Search.protoTypes = {
      callback : PropTypes.func,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.onFetchFromGitHub();
  }

  handleChange = event => {
    this.setState({ query: event.target.value }, this.HandleSubmit);
    console.log(this.state.query);
  };

  handleSubmit = event => {
    this.onFetchFromGitHub(this.state.query);
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
      this.props.callback(this.state.data);
  };

	render() {
		return (
			<div>
				<form  className="search-wrapper">
					<input
          className="search-input"
          type="text"
          name="search"
          placeholder="Find repositories..."
          value={this.state.value} onChange={this.handleChange}/>
					<button type="button" onClick={this.handleSubmit} className="search">Search</button>
				</form>
			</div>
		)
	}
}
class Repositories extends Component {
	render() {
		return (
      <Table data={this.props.data} editType="Add"/>
    )

	}
}
class Table extends Component {
	render() {
    if(this.props.data !== null) {
      for(let i = 0; i < this.props.data; i++) {
        console.log(this.props.data.node);
      }
    }
		return (
			<div className="table-wrapper">
				<table>
          <tbody>
  					<tr>
  						<th>Name</th>
  						<th>Language</th>
  						<th>Latest tag</th>
  					</tr>
  					<Row editType={this.props.editType}/>
  					<Row editType={this.props.editType}/>
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
				<td className="edit-button"><RowMutationButton editType= {this.props.editType}/></td>
			</tr>
		)
	}
}
class RowMutationButton extends Component {
	constructor(props) {
 		super(props);
	}
	render() {
		return(
			<button className="button-edit">{ this.props.editType }</button>
		)
	}
}
class RightPannel extends Component {
  constructor(props) {
    super(props);
    this.state = { favorites : [] };
  }
	render() {
		return(
			<div className="rightPannel">
				<Favorites data={this.state.favorites}/>
			</div>
		)
	}
}
class Favorites extends Component {
	render() {
		return <Table data={this.props.favorites} editType="Remove"/>
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
