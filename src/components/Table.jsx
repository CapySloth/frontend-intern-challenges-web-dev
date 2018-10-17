import React, { Component } from 'react';

class Table extends Component {
	render() {
    let hasData = false;
    let items = [];

    if(this.props.data !== null) {
      items = this.props.data;
      if(items.length !== 0) {
        hasData = true;
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

export default Table;
