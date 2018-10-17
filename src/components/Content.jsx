import React, { Component } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: []
    };
  }
  setDataToLocalStorage = (data) => {
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
    this.setDataToLocalStorage(this.state.favorites);
  }
	render() {
		return(
			<div className="content">
				<LeftPanel handleAddFavorite={this.handleAddFavorite.bind(this)} favorites={this.state.favorites}/>
				<RightPanel handleRemoveFavorite={this.handleRemoveFavorite.bind(this)} favorites={this.state.favorites}/>
			</div>
		)
	}
}
export default Content;
