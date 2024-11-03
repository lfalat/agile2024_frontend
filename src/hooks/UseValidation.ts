import { useState } from 'react';

interface ValidationResult {
  emailError: boolean;
  emailErrorMessage: string;
  passwordError: boolean;
  passwordErrorMessage: string;
  passwordStrength: 'silné' | 'stredné' | 'slabé';
  validateInputs: (email: string, password: string) => boolean;
  checkPasswordStrength: (password: string) => void;
}

const useValidation = (): ValidationResult => {
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<'silné' | 'stredné' | 'slabé'>('slabé');

  
  const validateInputs = (email: string, password: string): boolean => {
    let isValid = true;

    
    if (!email) {
      setEmailError(true);
      setEmailErrorMessage('Prosím zadajte emailovú adresu.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Prosím zadajte emailovú adresu v platnom formáte (pouzivatel@email.com).');
      isValid = false;
    } else if (/\.{2,}/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Emailová adresa nesmie obsahovať viacej bodiek za sebou.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Prosím zadajte emailovú adresu s platným doménovým menom.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage('Prosím zadajte heslo.');
      isValid = false;
    } else if (password.length < 13) {
      setPasswordError(true);
      setPasswordErrorMessage('Heslo musí mať minimálne 13 znakov.');
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Heslo musí obsahovať aspoň jedno veľké písmeno (A-Z).');
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Heslo musí obsahovať aspoň jedno malé písmeno (a-z).');
      isValid = false;
    } else if (!/\d/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Heslo musí obsahovať aspoň jednu číslicu (0-9).');
      isValid = false;
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Heslo musí obsahovať aspoň jeden špeciálny znak (napr. !@#$%^&*).');
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
      setPasswordStrength('silné');
    } else if (password.length >= 13) {
      setPasswordStrength('stredné');
    } else {
      setPasswordStrength('slabé');
    }
  };

  
  return { emailError, emailErrorMessage, passwordError, passwordErrorMessage, passwordStrength, validateInputs, checkPasswordStrength };
};

export default useValidation;