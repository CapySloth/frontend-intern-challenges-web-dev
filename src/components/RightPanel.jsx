import React, { Component } from 'react';
import Favorites from './Favorites';

class RightPanel extends Component {
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
  			<div className="rightPanel">
          <Favorites handleRemoveFavorite={this.props.handleRemoveFavorite} data={this.state.data}/>
  			</div>
  		)
    } else {
      return(
        <div className="rightPanel"></div>
      )
    }
	}
}

export default RightPanel;
