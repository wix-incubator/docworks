import React from 'react';
import {observer} from 'mobx-react';

import Navigation from './components/Navigation';
import Content from './components/Content';
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
                   <Content/>
               }

           />

    );
    }
}
