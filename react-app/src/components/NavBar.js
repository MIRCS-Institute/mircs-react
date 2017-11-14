import React, {Component} from 'react';
//import RaisedButton from 'material-ui/RaisedButton';
import Button from 'material-ui/Button'

export default class NavBar extends Component
{
	render()
	{
		return(
			<div className="NavBar">
				<Button>Home</Button>
				<Button>FAQ</Button>
				<Button>About</Button>
			</div>
		);
	}
}
