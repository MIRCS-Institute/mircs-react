import React from 'react';
import { Link, Route } from 'react-router-dom'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Button from 'material-ui/Button'
import logo from './HEADER.png';
import Grid from 'material-ui/Grid'

const ProfilePage = () =>(
	<div className="ProfilePage">
		
		
		
		
		<Grid container spacing={16} direction='row'>

      		{/* Side menu */}
      		<Grid item xs={12} sm={2}>
				<div className="Sidebar">
					I am to the side.
				</div>
            </Grid>

      		{/* Content */}
      		<Grid item xs={12} sm={8}>
				<div className="Profile">
					<h1 className="Name">
						NAME
					</h1>
			
					<p className="Description">
						The long description with loads of text.
					</p>
			
				</div>
            </Grid>

        </Grid>
		
		
    </div>
);

export default ProfilePage;