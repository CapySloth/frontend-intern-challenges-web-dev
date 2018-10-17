import React, { Component } from 'react';

class Header extends Component {
	render() {
		return <header title={ this.props.title }>
				<h1>{ this.props.title }</h1>
			</header>
	}
}

export default Header;
