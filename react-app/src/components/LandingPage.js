import React from 'react';
import { Link, Route } from 'react-router-dom'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Button from 'material-ui/Button'
import logo from './HEADER.png';

const LandingPage = () =>(
	<div className="Landing">
        <img src={logo} className="App-Logo" alt="logo"/>
		
		<div className="Header-Name">
			<h1>Welcome to MIRCS</h1>
        </div>     
        
		<center>
		
		<div className="Landing-intro">
		
			<div className="TopColor">
			</div>
		
			<div className="Container">
				<h3>
					The social network that connects you to the historic past of Nova Scotia!
				</h3>
				
				<h3>
					-Explore our past like never before!
				</h3>   
				
				<h3>
					-Browse through records, to rediscover our provinces lost buildings, monuments, and people.
				</h3>
			</div>
         
			<div className="Container">
				<h3>
					Additional features include:
				</h3>
			
				<h3>
					-Delving into the "accounts" of old historians!
				</h3>   
        
				<h3>
					-Have family roots here? Find out by exploring the family tree!
				</h3>
        
				<h3>
					-Best of all, its YOU who contributes to the information provided!
				</h3>
			</div>    
        </div>       
        
		<div className="Landing-intro-button">
			<div className="Landing-intro-button-space">
			</div>
        
			<Link to="/home">	
				<Button><ListItemText primary="Let's go!"/></Button>
			</Link> 
		</div>
		</center>
    </div>
);

export default LandingPage;