import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

export default function CheckoutSteps(props: {
  step1?: boolean
  step2?: boolean
  step3?: boolean
  step4?: boolean
  step1Complete?: boolean
  step2Complete?: boolean
  step3Complete?: boolean
  step4Complete?: boolean
}) {
  return (
    <Row className="checkout-steps" style={{ cursor: 'pointer' }}>
      <Col className={props.step1 ? 'active' : ''}>
        {props.step1Complete ? <Link className="checkout-link" to="/signin">Sign-In</Link> : 'Sign-In'}
      </Col>
      <Col className={props.step2 ? 'active' : ''}>
        {props.step1Complete ? <Link className="checkout-link" to="/shipping">Shipping</Link> : 'Shipping'}
      </Col>
      <Col className={props.step3 ? 'active' : ''}>
        {props.step2Complete ? <Link className="checkout-link" to="/payment">Payment</Link> : 'Payment'}
      </Col>
      <Col className={props.step4 ? 'active' : ''}>
        {props.step3Complete ? <Link className="checkout-link" to="/placeorder">Place Order</Link> : 'Place Order'}
      </Col>
    </Row>
  );
}
