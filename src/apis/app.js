import React from 'react';
import {observer} from 'mobx-react';

import Navigation from './components/Navigation';
import Layout from './components/Layout';

@observer
export default class App extends React.Component {
    render() {
        return (
           <Layout
               navigation={
                   <Navigation/>
               }
               content={
                   <div>hello</div>
               }

           />

    );
    }
}
