import React from 'react';

const About = () => (
    <div className="Halifax-text">
        <div className="TopSpace"></div>
        <center>
            <div className="TopColor"></div>
            <div className="Container">
                <h2>About Us</h2>
                <div className="Highlight">
                </div>
                <div style={styles.paragraph}>
                    <p>The MIRCS Institute is a community organization devoted to research,
                        education, and the development of social infrastructure for the renewal of civil
                        society. It is a non-profit, and set up as a registered society. We see
                        ourselves as a meaning-making institution.
                    </p>

                    <div className="Highlight">
                        <h3>Mission</h3>
                    </div>
                    <p>Contemporary conceptions of civil society were developed around the
                        resistance in Poland and Eastern Europe to the Soviet occupation of their
                        countries, and played a key intellectual role in the fall of the Soviet Union.
                        We believe that there are strong grounds for seeing the rebuilding of civil
                        society - community organizations / non-profits / voluntary associations / the
                        third sector - as the basis for other richer and more authentic options than the
                        dichotomy between the market and the state allows. We are dedicated, therefore,
                        to the renewal of civil society.</p>
                    <p>We seek to play a part in opening such possibilities for renewal. The
                        Institute was formed out of an initial interest in research and education in
                        regional history and historical gis in the Maritimes, but has developed
                        interests in the economics of non-profits and community banks, rural
                        sustainability, community health, and urban development, and the law and
                        jurisprudence of civil society. Our objects, therefore, include scholarly and
                        policy research, education, and social infrastructure. And doing so by
                        collaborating with other community organizations, academies, and civil society
                        champions to achieve these aims.</p>
                </div>
                <div className="containerU"></div>
            </div>
        </center>
        <div className="BottomSpace"></div>
    </div>
);

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
        textAlign: "left",
        lineHeight: "1.5"
    }
}

export default About;