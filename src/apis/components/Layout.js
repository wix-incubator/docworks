import React, {PropTypes} from 'react';
import styles from './Layout.scss';


const Layout = ({navigation, content}) =>
    <div className={styles.flex} >
        <div className={styles.navigation}>
            {navigation}
        </div>
        <div className={styles.content}>
            {content}
        </div>
    </div>;


export default Layout;