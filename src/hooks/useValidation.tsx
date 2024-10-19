import { useState } from 'react';

interface ValidationResult {
  emailError: boolean;
  emailErrorMessage: string;
  passwordError: boolean;
  passwordErrorMessage: string;
  passwordStrength: 'strong' | 'medium' | 'weak';
  validateInputs: (email: string, password: string) => boolean;
  checkPasswordStrength: (password: string) => void;
}

const useValidation = (): ValidationResult => {
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<'strong' | 'medium' | 'weak'>('weak');

  
  const validateInputs = (email: string, password: string): boolean => {
    let isValid = true;

    
    if (!email) {
      setEmailError(true);
      setEmailErrorMessage('Please enter your email address.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address (e.g., user@example.com).');
      isValid = false;
    } else if (/\.{2,}/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Email cannot contain consecutive dots.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email with a valid domain name.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage('Please enter your password.');
      isValid = false;
    } else if (/\s/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password cannot contain spaces.');
      isValid = false;
    } else if (password.length < 13) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 13 characters long.');
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must contain at least one uppercase letter (A-Z).');
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must contain at least one lowercase letter (a-z).');
      isValid = false;
    } else if (!/\d/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must contain at least one digit (0-9).');
      isValid = false;
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must contain at least one special character (e.g., !@#$%^&*).');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    
    if (isValid) {
      checkPasswordStrength(password);
    }

    return isValid;
  };

  
  const checkPasswordStrength = (password: string) => {
    if (
      password.length >= 15 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      setPasswordStrength('strong');
    } else if (password.length >= 13) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };

  
  return { emailError, emailErrorMessage, passwordError, passwordErrorMessage, passwordStrength, validateInputs, checkPasswordStrength };
};

export default useValidation;
