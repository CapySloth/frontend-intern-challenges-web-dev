import React, { Component } from 'react';
import './data-fetch.js';
import './reset.css';
import './App.css';

import axios from 'axios';
import PropTypes from 'prop-types';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: 'bearer bbad63ae02ea151edc38a2511ed5d972cfe791ca',
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
  constructor(props){
    super(props);
    this.state= { data : [] }
    this.handleDataUpdate = this.handleDataUpdate.bind(this);
  }
  handleDataUpdate(response) {
    this.setState({
      data: response
    });
  }
	render() {
		return (
			<div className="leftPannel">
				<Search handleDataUpdate={this.handleDataUpdate.bind(this)}/>
				<Repositories data={this.state.data}/>
			</div>
		)
	}
}

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
    this.setState({ query: event.target.value }, this.HandleSubmit);
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
			<div>
				<form  className="search-wrapper">
					<input
            className="search-input"
            type="text"
            name="search"
            placeholder="Find repositories..."
            value={this.state.value}
            onChange={this.handleChange}/>
					<button
            type="button"
            onClick={this.handleSubmit}
            className="search">Search</button>
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
    let hasData = false;
    let items = [];
    if(this.props.data !== null) {
      items = this.props.data;
      console.log(typeof(items))
      if(items != null) {
        if(items.length !== 0) {
          hasData = true;
        }
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
            {hasData &&
                items.map(item => <Row
                key={item.node.id}
                link={item.node.url}
                name={item.node.nameWithOwner}
                language={(item.node.primaryLanguage === null) ? "-" : item.node.primaryLanguage.name }
                tag={(item.node.tags.edges.length === 0) ? "-" : item.node.tags.edges[0].tag.name}
                editType={this.props.editType}/>)
            }
            {!hasData && <tr></tr>}
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
				<td><a href={this.props.link}>{this.props.name}</a></td>
				<td>{this.props.language}</td>
				<td>{this.props.tag}</td>
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
/* <Favorites data={this.state.favorites}/>*/
class RightPannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: []
    };
    //console.log(this.state.favorites);
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
