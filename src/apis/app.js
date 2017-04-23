import React from 'react';
import {observer} from 'mobx-react';

import {
    SideMenu,
    Button
} from 'wix-style-react';

import HelpIcon from 'wix-style-react/dist/src/Icons/dist/components/Help';
import TrashIcon from 'wix-style-react/dist/src/Icons/dist/components/Trash3';
import ChatIcon from 'wix-style-react/dist/src/Icons/dist/components/Chat';
import SubLink from './components/NavigationSubLink';
import Layout from './components/Layout';

@observer
export default class App extends React.Component {
    render() {
        return (
           <Layout
               navigation={
                   <div style={{width: 220, "height": "100%"}}>
                       <SideMenu>
                           <SideMenu.Logo onClick={() => console.log('Logo clicked')}>
                               <TrashIcon size="5em"/>
                               <h2 style={{color: '#fff'}}>Wix APIs</h2>
                           </SideMenu.Logo>

                           <SideMenu.Navigation>
                               <SideMenu.NavigationLink onClick={() => console.log('#1 clicked')}>
                                   Home
                               </SideMenu.NavigationLink>

                               <SideMenu.NavigationLink isActive onClick={() => console.log('#2 clicked')}>
                                   Wix Code APIs
                               </SideMenu.NavigationLink>

                               <SubLink isActive isSubActive onClick={() => console.log('#3 clicked')}>
                                   Tasks
                               </SubLink>

                               <SubLink isActive onClick={() => console.log('#4 clicked')}>
                                   APIs
                               </SubLink>

                           </SideMenu.Navigation>

                           <SideMenu.Promotion>
                               <Button
                                   theme="fullpurple"
                                   onClick={() => console.log('Promotion button clicked!')}
                               >
                                   Buy 1 for price of 2!
                               </Button>
                           </SideMenu.Promotion>

                           <SideMenu.Footer>
                               <SideMenu.FooterLink
                                   href="https://support.wix.com/"
                                   target="_blank"
                                   icon={<HelpIcon size="1em"/>}
                               >
                                   Help Me!
                               </SideMenu.FooterLink>

                               <SideMenu.FooterTinyLink
                                   href="https://support.wix.com/en/article/wix-seo-wiz-suggestions-and-feedback"
                                   target="_blank"
                                   icon={<div style={{marginTop: 2}}><ChatIcon size="1em"/></div>}
                                   tooltip="Hey, come talk to me!"
                                   onClick={() => console.lo('clicked on tiny link yay!')}
                               />
                           </SideMenu.Footer>
                       </SideMenu>
                   </div>
               }
               content={
                   <div>hello</div>
               }

           />

    );
    }
}
