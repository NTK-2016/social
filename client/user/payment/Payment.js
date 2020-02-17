import React, {Component} from 'react';
import CheckoutForm from './CheckoutForm';

class Payment extends Component {
  render() {
    return (
      <StripeProvider apiKey="pk_test_3Y8GStXmEoPOic8094YHVFFZ00aEB4CUyJ">
        <div className="example">
          <h1>React Stripe Elements Example</h1>
          <Elements>
            <CheckoutForm />
          </Elements>
        </div>
      </StripeProvider>
    );
  }
}

export default Payment;