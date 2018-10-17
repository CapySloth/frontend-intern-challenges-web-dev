import React, { Component } from 'react';
import Table from './Table'
class Repositories extends Component {
	render() {
		return (
      <Table handleAddFavorite={this.props.handleAddFavorite} favorites={this.props.favorites} data={this.props.data} editType="Add"/>
    )
	}
}

export default Repositories;
