import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button'

const Contact = (class extends React.Component {
render() {
	return (
	<div className="Halifax-text">
	<center>
		<div className="TopSpace"></div>
		<div className="TopColor"></div>
		<div className="Container">
			<h1>CONTACT</h1>
			<div className="Highlight">
				<h2>Geo-Genealogy</h2>
			</div>
			<div style={styles.paragraph}>
			<p>
			Since the fall of 2014, we have been building initial components for a
			geo-genealogy prototype for the province. Working partnerships have been formed
			with the Heritage Trust of Nova Scotia, the Genealogical Association of Nova
			Scotia, and the Durham Heritage Society. Several faculty at Dalhousie University
			- within the Business School, the GISciences Centre, & Faculty of Computer
			Science - have provided initial work.
			</p>
			<p>
			Historical maps are colourful and compelling for many people. The geography of
			those maps, though, is one way of introducing more context into our
			understanding of social patterns. The search for general social laws is long
			past dead, and much intellectual effort now is aimed at figuring out how to
			better incorporate temporal and spatial contexts into our knowledge of social
			phenomena. However, if social action is a result of the various purposes and
			beliefs which individuals hold, then our social understanding must become very
			local indeed. We accept the geographer's argument that geography, by locating
			action in space, contextualizes it in another equally fundamental way to history
			which contextualizes time. We think, therefore, that historical gis which
			contextualizes both time and space is a tool which can greatly advance this kind
			of improved understanding of context.
			</p>
			</div>
			<p></p>
			<br></br>
			<div style={styles.form}>
			<form>
				<TextField autoFocus margin='dense' label='Name' type='text' fullWidth style={styles.formInput} hintText="Name"/>
				<br></br>
				<br></br>
				<TextField autoFocus margin='dense' label='Email' type='text' fullWidth style={styles.formInput} hintText="Email"/>
				<br></br>
				<br></br>
				<TextField autoFocus margin='dense' label='Subject' type='text' fullWidth style={styles.formInput} hintText="Subject"/>
				<br></br>
				<br></br>
				<TextField autoFocus margin='dense' label='Message' type='text' fullWidth style={styles.formInput} hintText="Message"/>
				<br></br>
				<br></br>
				<Button style={styles.formInput}raised color='primary' type="submit" value="Submit">
					Submit
				</Button>
				<br></br>
				<br></br>
			</form>
			<br></br>
			Outline of Program Concept<br></br>
			Community Prototype: Old North End Halifax<br></br>
			Community Prototype: Durham Community<br></br>
			<p></p>
			<p>
			Workflow Plan: Workflow Schematic
			<br></br>
			Research Paper: Building an Historical GIS Platform from Archival Data
			</p>
			</div>
			<div className="containerU"></div>
		</div>
		<div className="BottomSpace"></div>
	</center>
</div>
)}
});

const styles = {
    paragraph: {
        position: 'relative',
        width: '60%',
        textAlign: "justify",
        lineHeight: "1.5"
    },
    form: {
        fontSize: "14px",
        position: 'relative',
        width: '60%',
		lineHeight: "1.5",
		textAlign: "center",
		alignItems: "center"
	},
	formInput: {
		width: "50%",
	},
}

export default Contact;