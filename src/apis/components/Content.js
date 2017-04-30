import React from 'react';

import {
    Container,
    Row,
    Col,
    Card
} from 'wix-style-react/dist/src/Grid';
import {Breadcrumbs} from 'wix-style-react';
import typography from 'wix-style-react/dist/src/Typography';
import CodeLine from './CodeLine';

const items = [{id: '1', value: 'Home'}, {id: '2', value: 'Wix Code APIs'}];


const Content = () =>
    <Container>
        <div>
            <Breadcrumbs items={items}
                         theme={'onGrayBackground'}/>
        </div>
        <div>
            <h1 className={typography.h1}>Wix Code APIs</h1>
        </div>
        <Row>
             <Col span={8}>
                 <Row>
                 <Card>
                     <Card.Header title="$w.ClickableMixin"/>
                     <Card.Content>
                         <CodeLine code="function onClick(handler: MouseEventHandler): Element" labels={['new']}></CodeLine>
                         <CodeLine code="function onDblClick(handler: MouseEventHandler): Element"></CodeLine>
                     </Card.Content>
                 </Card>
                 </Row>
                 <Row>
                 <Card>
                     <Card.Header title="$w.CollapsedMixin"/>
                     <Card.Content>
                         <CodeLine code="get collapsed(): boolean"/>
                         <CodeLine code="function collapse(): Promise&lt;void&gt;"/>
                         <CodeLine code="function expand(): Promise&lt;void&gt;"/>
                     </Card.Content>
                 </Card>
                 </Row>
                 <Row>
                 <Card>
                     <Card.Header title="An API"/>
                     <Card.Content>
                         hello
                     </Card.Content>
                 </Card>
                 </Row>
             </Col>
             <Col span={4}>
                 <Card>
                     <Card.Header title="An API"/>
                     <Card.Content>
                         other allow
                     </Card.Content>
                 </Card>
             </Col>
         </Row>
     </Container>;


export default Content;