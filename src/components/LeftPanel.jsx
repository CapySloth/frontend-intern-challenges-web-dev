import React, { Component } from 'react';
import Search from './Search';
import Repositories from './Repositories'
class LeftPanel extends Component {
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
    if(this.state.data != null && this.state.data.length !== 0) {
      return(
        <div className="leftPanel">
  				<Search handleDataUpdate={this.handleDataUpdate.bind(this)}/>
  				<Repositories handleAddFavorite={this.props.handleAddFavorite} favorites={this.props.favorites} data={this.state.data}/>
  			</div>
      )
    } else {
      return(
        <div className="leftPanel">
          <Search handleDataUpdate={this.handleDataUpdate.bind(this)}/>
        </div>
      )
    }
  }
}

export default LeftPanel;
