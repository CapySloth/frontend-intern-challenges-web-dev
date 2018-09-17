import React, { Component } from 'react';
import './data-fetch.js';
import './reset.css';
import './App.css';

import axios from 'axios';
import PropTypes from 'prop-types';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: 'bearer 1396f433bb35970f8c3c74189aef194105281f8d',
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
/*{ items.map(item =>
  <Row link={item.link} name={item.name} language={this.props.language} tag={this.props.tag}/> )}*/
class Table extends Component {
	render() {
    let items = [];
    let hasData = false;
    if(this.props.data !== null) {
      hasData = true;
      //console.log(this.props.data)
      items = this.props.data;
      console.log(this.props.data)
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
            {items.map(item => <Row link={item.node.url} name={item.node.name} language={item.node.primaryLanguage.name} tag="2" editType={this.props.editType}/>)}
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
