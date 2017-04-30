import React, {PropTypes} from 'react';
import styles from './CodeLine.scss';

const labelNames = ['new', 'changed', 'removed', 'hidden', 'draft', 'no-spec', 'no-docs'];

const CodeLine = ({code, labels}) =>
    <div className={styles.code}>
        <span>{code}</span>
        {labelNames.map((label) => {
            if (labels && labels.indexOf(label) > -1)
                return <span key={label} className={styles[label]}>{label}</span>;
            else
                return '';
        })}
    </div>;



export default CodeLine;
