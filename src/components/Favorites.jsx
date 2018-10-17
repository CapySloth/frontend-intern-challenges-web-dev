import React, { Component } from 'react';
import Table from './Table'

class Favorites extends Component {
	render() {
		return <Table data={this.props.data} handleRemoveFavorite={this.props.handleRemoveFavorite} favorites={this.props.data} editType="Remove"/>
	}
}
export default Favorites;
