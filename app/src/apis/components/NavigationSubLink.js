import React, {PropTypes} from 'react';
import {SideMenu} from 'wix-style-react';
import classnames from 'classnames';

import styles from './NavigationSubLink.scss';


const SubLink = ({children, isDiminishedHover, isActive, isSubActive, ...rest}) =>
    <div
        className={classnames({
            [styles.sublink]: true,
            [styles.sublinkActive]: isSubActive
    })}>
        <div className={styles.sublinkBar}></div>
        <SideMenu.NavigationLink isActive={isActive} isDiminishedHover={isDiminishedHover} {...rest}>
            {children}
        </SideMenu.NavigationLink>
    </div>;

SubLink.propTypes = {
    children: PropTypes.node,
    isActive: PropTypes.bool,
    isDiminishedHover: PropTypes.bool,
    isSubActive: PropTypes.bool
};

export default SubLink;
