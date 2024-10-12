import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./HardDisk.css"

export default function HardDisk({ disk }) {
    const renderDisk = () => {
        return disk.map((block, index) => (
            <div
                key={index}
                className={`cell ${block ? "used" : "unused"}`}
            />
        ));
    };
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col>Hard Disk</Col>
            </Row>
            <Row>
                <Col>
                    <div className="disk-container">
                        {renderDisk()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}