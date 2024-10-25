// Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    shippingInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    billingInfo: {
      sameAsShipping: true,
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    paymentInfo: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
    deliveryMethod: 'standard',
  });

  useEffect(() => {
    fetchCart();
    fetchUserProfile();
  }, []);

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/api/carts/user/${userId}`);
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
      const userProfile = response.data;

      setFormData((prev) => ({
        ...prev,
        shippingInfo: {
          ...prev.shippingInfo,
          firstName: userProfile.firstName || '',
          lastName: userProfile.lastName || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          address: userProfile.address || '',
        },
      }));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // If billing is same as shipping, update billing info
    if (section === 'shippingInfo' && formData.billingInfo.sameAsShipping) {
      const billingFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country'];
      if (billingFields.includes(field)) {
        setFormData((prev) => ({
          ...prev,
          billingInfo: {
            ...prev.billingInfo,
            [field]: value,
          },
        }));
      }
    }
  };

  const validateForm = (step) => {
    const newErrors = {};

    if (step === 1) {
      const shippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      shippingFields.forEach((field) => {
        if (!formData.shippingInfo[field]) {
          newErrors[`shipping_${field}`] = 'This field is required';
        }
      });

      // Email validation
      if (formData.shippingInfo.email && !/\S+@\S+\.\S+/.test(formData.shippingInfo.email)) {
        newErrors.shipping_email = 'Invalid email format';
      }

      // Phone validation
      if (formData.shippingInfo.phone && !/^\d{10}$/.test(formData.shippingInfo.phone.replace(/\D/g, ''))) {
        newErrors.shipping_phone = 'Invalid phone number';
      }
    }

    if (step === 2 && !formData.billingInfo.sameAsShipping) {
      const billingFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
      billingFields.forEach((field) => {
        if (!formData.billingInfo[field]) {
          newErrors[`billing_${field}`] = 'This field is required';
        }
      });
    }

    if (step === 3) {
      const paymentFields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
      paymentFields.forEach((field) => {
        if (!formData.paymentInfo[field]) {
          newErrors[`payment_${field}`] = 'This field is required';
        }
      });

      // Card number validation
      if (formData.paymentInfo.cardNumber && !/^\d{16}$/.test(formData.paymentInfo.cardNumber.replace(/\s/g, ''))) {
        newErrors.payment_cardNumber = 'Invalid card number';
      }

      // CVV validation
      if (formData.paymentInfo.cvv && !/^\d{3,4}$/.test(formData.paymentInfo.cvv)) {
        newErrors.payment_cvv = 'Invalid CVV';
      }

      // Expiry date validation
      if (formData.paymentInfo.expiryDate && !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.paymentInfo.expiryDate)) {
        newErrors.payment_expiryDate = 'Invalid expiry date (MM/YY)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepChange = (newStep) => {
    if (validateForm(step)) {
      setStep(newStep);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(step)) return;

    try {
      const userId = localStorage.getItem('userId');
      const orderData = {
        userId,
        shippingAddress: `${formData.shippingInfo.address}, ${formData.shippingInfo.city}, ${formData.shippingInfo.state} ${formData.shippingInfo.zipCode}`,
        paymentMethod: 'credit_card',
        orderItems: cart.cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await axios.post(`http://localhost:8080/api/orders/user/${userId}`, orderData);
      await axios.delete(`http://localhost:8080/api/carts/user/${userId}/clear`);
      setOrderPlaced(true);

      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600">Thank you for your purchase. Redirecting to order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {['Shipping', 'Billing', 'Payment', 'Review'].map((stepName, index) => (
              <div key={stepName} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > index + 1 ? 'bg-green-500' :
                  step === index + 1 ? 'bg-blue-500' : 'bg-gray-300'
                } text-white font-semibold`}>
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">{stepName}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 relative">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full">
              <div className={`h-full bg-blue-500 transition-all duration-300`} 
                style={{ width: `${((step - 1) / 3) * 100}%` }}>
              </div>
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(formData.shippingInfo).map((key) => (
                  <div key={key} className="relative">
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input
                      type={key.includes('name') ? 'text' : key === 'email' ? 'email' : 'text'}
                      id={key}
                      value={formData.shippingInfo[key]}
                      onChange={(e) => handleInputChange('shippingInfo', key, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors[`shipping_${key}`] && <p className="text-red-600 text-xs">{errors[`shipping_${key}`]}</p>}
                  </div>
                ))}
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="sameAsShipping"
                  checked={formData.billingInfo.sameAsShipping}
                  onChange={() => setFormData((prev) => ({
                    ...prev,
                    billingInfo: {
                      ...prev.billingInfo,
                      sameAsShipping: !prev.billingInfo.sameAsShipping,
                    },
                  }))}
                  className="mr-2"
                />
                <label htmlFor="sameAsShipping" className="text-sm text-gray-600">Billing address same as shipping</label>
              </div>
              <div className="mt-6">
                <button type="button" className="bg-blue-600 text-white rounded-lg px-4 py-2"
                  onClick={() => handleStepChange(2)}>Next</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
              {!formData.billingInfo.sameAsShipping && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(formData.billingInfo).filter(key => key !== 'sameAsShipping').map((key) => (
                    <div key={key} className="relative">
                      <label htmlFor={key} className="block text-sm font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input
                        type="text"
                        id={key}
                        value={formData.billingInfo[key]}
                        onChange={(e) => handleInputChange('billingInfo', key, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors[`billing_${key}`] && <p className="text-red-600 text-xs">{errors[`billing_${key}`]}</p>}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <button type="button" className="bg-blue-600 text-white rounded-lg px-4 py-2 mr-2"
                  onClick={() => handleStepChange(1)}>Back</button>
                <button type="button" className="bg-blue-600 text-white rounded-lg px-4 py-2"
                  onClick={() => handleStepChange(3)}>Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(formData.paymentInfo).map((key) => (
                  <div key={key} className="relative">
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input
                      type={key === 'cvv' ? 'password' : 'text'}
                      id={key}
                      value={formData.paymentInfo[key]}
                      onChange={(e) => handleInputChange('paymentInfo', key, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors[`payment_${key}`] && <p className="text-red-600 text-xs">{errors[`payment_${key}`]}</p>}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button type="button" className="bg-blue-600 text-white rounded-lg px-4 py-2 mr-2"
                  onClick={() => handleStepChange(2)}>Back</button>
                <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2">Place Order</button>
              </div>
            </div>
          )}
        </form>

        {errors.submit && <p className="text-red-600 text-xs">{errors.submit}</p>}
      </div>
    </div>
  );
};

export default Checkout;
