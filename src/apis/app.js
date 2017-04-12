import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

import Button from 'wix-style-react/src/Button'
import styles from "wix-style-react/src/Button/Button.scss"
import styles2 from "wix-style-react/src/ButtonLayout/ButtonLayout.scss"
import {Close} from 'wix-style-react/src/Icons/dist';

const style = {
    display: 'inline-block',
    padding: '0 5px',
    width: '140px',
    lineHeight: '22px'
};

@observer
export default class App extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <div className="ltr" style={style}>
                        Prefix<br/>
                        <Button id="button" dataHook="story-button-prefix" prefixIcon={<Close/>}>Prefix</Button>
                    </div>

                    <div className="ltr" style={style}>
                        Suffix<br/>
                        <Button id="button" dataHook="story-button-suffix" suffixIcon={<Close/>}>Suffix</Button>
                    </div>
                </div>
            </div>
        );
    }
}
