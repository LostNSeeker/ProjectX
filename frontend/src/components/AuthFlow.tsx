import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import PaymentScreen from './PaymentScreen';
import OnboardingForm from './OnboardingForm';

type AuthStep = 'login' | 'register' | 'payment' | 'onboarding' | 'complete';

interface AuthFlowProps {
  onAuthComplete: () => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthComplete }) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    onAuthComplete();
  };

  const handleSwitchToRegister = () => {
    setCurrentStep('payment');
  };

  const handleSwitchToLogin = () => {
    setCurrentStep('login');
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentIntentId(paymentId);
    setCurrentStep('register');
  };

  const handlePaymentCancel = () => {
    setCurrentStep('login');
  };

  const handleRegisterSuccess = () => {
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    onAuthComplete();
  };

  switch (currentStep) {
    case 'login':
      return (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    
    case 'payment':
      return (
        <PaymentScreen
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      );
    
    case 'register':
      return (
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
          paymentIntentId={paymentIntentId || undefined}
        />
      );
    
    case 'onboarding':
      return (
        <OnboardingForm
          onComplete={handleOnboardingComplete}
        />
      );
    
    default:
      return null;
  }
};

export default AuthFlow;
