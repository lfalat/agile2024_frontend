import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useValidation from './useValidation';
import { login } from '../services/api/authService';

interface ApiError {
  message: string; 

}

export const useLoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>(''); 



  const {
    emailError,
    emailErrorMessage,
    passwordError,
    passwordErrorMessage,
    passwordStrength,
    validateInputs,
    checkPasswordStrength
  } = useValidation();

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 

    const isValid = validateInputs(email, password);
    if (!isValid) {
      return; 
    }

    try {
      const data = await login(email, password);
      console.log('Login successful:', data);
      navigate('/homepage');
    } catch (error) {
      console.error('Login failed:', error);

      const apiError = error as { response?: { data: ApiError } };

      if (apiError.response && apiError.response.data) {
        if (apiError.response.data.message === 'email_not_found') {   
          setErrorMessage('Nerozpoznaná emailová adresa.'); 
        } else if (apiError.response.data.message === 'incorrect_password') {
          setErrorMessage('Nesprávne heslo.'); 
        } else {
          setErrorMessage('Prihlásenie zlyhalo.');
        }
      } else {
        setErrorMessage('Prihlásenie zlyhalo.'); 
      }
    }
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    checkPasswordStrength(password);
  };

  return {
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    emailError,
    emailErrorMessage,
    passwordError,
    passwordErrorMessage,
    passwordStrength,
    errorMessage,
  };
};

export {};
