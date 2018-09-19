import React, { Component } from 'react';
import './reset.css';
import './App.css';

import axios from 'axios';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: 'bearer TOKEN',
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
    return [
      <Header key="header"/>,
      <Content key="content"/>
    ];
  }
}

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: []
    };
  }
  updateDataToLocalStorage = (data) => {
  	//Grab JSON data from local storage, if it does not exist create an empty array
  	let localData = JSON.parse(localStorage.getItem("github-data")) || [];
  	// Push the new data (whether it be an object or anything else) onto the array
    if(localData.length !== 0) {
      localData.pop();
    }
  	// Re-serialize the array back into a string and store it in localStorage
  	localStorage.setItem("github-data", JSON.stringify(data));
  }
  getDataFromLocalStorage() {
    let array = JSON.parse(localStorage.getItem("github-data"));
    if(array != null) {
      this.setState({favorites: array})
    }
  }
  handleAddFavorite = (rowToAdd) => {
    this.setState({
      favorites: [...this.state.favorites, rowToAdd]
    });
  }
  handleRemoveFavorite = (index) => {
    var array = [...this.state.favorites];
    array.splice(index, 1);
    this.setState({ favorites: array });
  }
  componentWillMount() {
    this.getDataFromLocalStorage();
  }
  componentDidUpdate() {
    //Can't get this stuff to store on Unmount or whatever represents termination of component on close/refresh of window.
    //Hence me storing it every update (Every time you add or Remove something to Favorites)
    this.updateDataToLocalStorage(this.state.favorites);
  }
	render() {
		return(
			<div className="content">
				<LeftPannel handleAddFavorite={this.handleAddFavorite.bind(this)} favorites={this.state.favorites}/>
				<RightPannel handleRemoveFavorite={this.handleRemoveFavorite.bind(this)} favorites={this.state.favorites}/>
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
    if(this.state.data.length !== 0 && this.state.data != null) {
      return(
        <div className="leftPannel">
  				<Search handleDataUpdate={this.handleDataUpdate.bind(this)}/>
  				<Repositories handleAddFavorite={this.props.handleAddFavorite} favorites={this.props.favorites} data={this.state.data}/>
  			</div>
      )
    } else {
      return(
        <div className="leftPannel">
          <Search handleDataUpdate={this.handleDataUpdate.bind(this)}/>
        </div>
      )
    }
  }
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
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
			<div  className="search-wrapper">
				<input
          className="search-input"
          type="text"
          name="search"
          placeholder="Find repositories..."
          value={this.state.value}
          onKeyPress={this._handleKeyPress}
          onChange={this.handleChange}/>
		      <button
          type="button"
          onClick={this.handleSubmit}
          className="search">Search</button>
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
        <td><button className="button-edit" onClick={(event) => this.handleClick(event, this.props.editType)}>{this.props.editType}</button></td>
      </tr>
      )
    }
	}
}

class RightPannel extends Component {
  constructor(props) {
    super(props);
    this.state= { data : this.props.favorites }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps != null) {
      this.setState({ data: nextProps.favorites})
    }
  }
	render() {
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
