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
			<h4>Main feautures:
			</h4>
				<p>
					The social network that connects you to the historic past of Nova Scotia!
				</p>
				
				<p>
					-Explore our past like never before!
				</p>   
				
				<p>
					-Browse through records, to rediscover our provinces lost buildings, monuments, and people.
				</p>
			</div>
         
			<div className="Container">
				<h4>
					Additional features include:
				</h4>
			
				<p>
					-Delving into the "accounts" of old historians!
				</p>   
        
				<p>
					-Have family roots here? Find out by exploring the family tree!
				</p>
        
				<p>
					-Best of all, it's you who contributes to the information provided!
				</p>
				<div className="containerU">
 			</div>  
			</div>
			  
        </div>       
        
		<div className="Landing-intro-button">
			<div className="Landing-intro-button-space">
			</div>
			<Link to="/home" style={styles.buttonT}>	
				<Button><h3>Let's go!</h3></Button>
			</Link> 
		</div>
		</center>
		<div className="App-Footer-Extension">
				</div>				
				<div className="App-Footer">
					<center>
						<h4>&copy;MARITIME INSTITUTE FOR CIVIL SOCIETY <br/>P.O. BOX 8041, HALIFAX, N.S. B3K 5L8</h4>
					</center>
				</div>
    </div>
);

const styles = {
 	buttonT: {
    textDecoration: 'none'
  },
};
export default LandingPage;