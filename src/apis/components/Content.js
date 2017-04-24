import React from 'react';

import {
    Container,
    Row,
    Col,
    Card
} from 'wix-style-react/dist/src/Grid';


const Content = () =>
    // <div></div>
    <Container>
         <Row>
             <Col span={8}>
                 <Row>
                 <Card>
                     <Card.Header title="An API"/>
                     <Card.Content>
                         hello
                         agagferg
                         aergaergaer<br/>
                         aergaergaeg
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