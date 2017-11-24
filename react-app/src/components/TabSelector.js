import React, {Component} from 'react';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom'

export default class TabSelector extends Component {
    render() {
        return (
            <div>
                <Link to="/map">
                    <Button>
                        Map
                    </Button>
                </Link>

                <Link to="/data">
                    <Button>
                        Data
                    </Button>
                </Link>
            </div>
        );
    }
}
