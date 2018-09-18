import React, { Component } from 'react';
import './data-fetch.js';
import './reset.css';
import './App.css';

import axios from 'axios';
import PropTypes from 'prop-types';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: 'bearer 78d2cf634c8cb19ca7fd3882de3dc1f9033e2cbc',
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
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: []
    };

    let handleAddFavorite = this.handleAddFavorite.bind(this);
    let removeFavorite = this.handleRemoveFavorite.bind(this);
  }
  handleAddFavorite = (rowToAdd) => {
    //Pass row information to Favorites, to update set with new information
    this.setState({
      favorites: [...this.state.favorites, rowToAdd]
    });
    //Is passing the prop more expensive, or the creating of an additional state, that is a smaller value
    //Put id of row added to the button, so that Add can be remove, great stuff
  }
  handleRemoveFavorite = (index) => {
    var array = [...this.state.favorites]; // make a separate copy of the array
    console.log(index)
    array.splice(index, 1);
    this.setState({ favorites: array });
    console.log(this.state.favorites)
    //delete row information from favorites array in favorites component,
    //delete row id from button control in repositories controller somewhere
    //Wow, easy pz.
  }
	render() {
		return(
			<div className="content">
				<LeftPannel handleAddFavorite={this.handleAddFavorite} favorites={this.state.favorites}/>
				<RightPannel handleRemoveFavorite={this.handleRemoveFavorite} favorites={this.state.favorites}/>
			</div>
		)
	}
}
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
				<Repositories handleAddFavorite={this.props.handleAddFavorite} favorites={this.props.favorites} data={this.state.data}/>
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
      <Table handleAddFavorite={this.props.handleAddFavorite} favorites={this.props.favorites} data={this.props.data} editType="Add"/>
    )

	}
}
class Table extends Component {
	render() {
    let hasData = false;
    let items = [];

    if(this.props.data !== null) {
      items = this.props.data;
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
                handleAddFavorite={this.props.handleAddFavorite}
                handleRemoveFavorite={this.props.handleRemoveFavorite}
                favorites={this.props.favorites}
                node={item}
                key={item.node.id}
                link={item.node.url}
                nameWithOwner={item.node.nameWithOwner}
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
//Fix edit button and button eddit stuff, ugly :(
class Row extends Component {
  handleClick = (event, editType) => {
    if(editType === "Add") {
      this.props.handleAddFavorite(this.props.node);
    } else if(editType === "Remove") {
      console.log(this.props.nameWithOwner)
      this.props.handleRemoveFavorite(this.props.favorites.indexOf(this.props.node));
    }
  }
	render() {
    let found = 0;
    if(this.props.favorites.length !== 0) {
      found = this.props.favorites.some(item => item.node.nameWithOwner === this.props.nameWithOwner);
    }
    if(found && this.props.editType === "Add") {
      return (
  			<tr>
  				<td><a href={this.props.link}>{this.props.nameWithOwner}</a></td>
  				<td>{this.props.language}</td>
  				<td>{this.props.tag}</td>
  				<td className="edit-button"></td>
  			</tr>
  		)
    } else {
      return (
      <tr>
        <td><a href={this.props.link}>{this.props.nameWithOwner}</a></td>
        <td>{this.props.language}</td>
        <td>{this.props.tag}</td>
        <td className="edit-button"><button className="button-edit" onClick={(event) => this.handleClick(event, this.props.editType)}>{this.props.editType}</button></td>
      </tr>
      )
    }
	}
}
/* <Favorites data={this.state.favorites}/>*/
class RightPannel extends Component {
  constructor(props) {
    super(props);
    this.state= { data : [] }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps != null) {
      this.setState({ data: nextProps.favorites})
    }
  }
	render() {
    console.log(this.state.data.length);
    if(this.state.data.length !== 0 && this.state.data != null) {
      return(
  			<div className="rightPannel">
          <Favorites handleRemoveFavorite={this.props.handleRemoveFavorite} data={this.state.data}/>
  			</div>
  		)
    } else {
      return(
        <div className="rightPannel"></div>
      )
    }
	}
}
class Favorites extends Component {
	render() {
		return <Table data={this.props.data} handleRemoveFavorite={this.props.handleRemoveFavorite} favorites={this.props.data} editType="Remove"/>
	}
}
export default App;
