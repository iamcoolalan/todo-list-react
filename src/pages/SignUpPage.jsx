import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from 'contexts/AuthContext';

const SignUpPage = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()
    const { register, isAuthenticated } = useAuth()

    const handleClick = async () => {
      if (userName.length === 0) {
      return
      }

      if (password.length === 0) {
        return;
      }

      if (userEmail.length === 0) {
        return;
      }

      const success = await register({ 
        username: userName,
        email: userEmail,
        password
       })

      if (success) {
        Swal.fire({
          title: '註冊成功',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          position: 'top'
        });

        return
      }

      Swal.fire({
        title: '註冊失敗',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000,
        position: 'top',
      });
    }

    useEffect(() => {
      if (isAuthenticated) {
        navigate('/todos')
      }
    }, [navigate, isAuthenticated]);

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>建立您的帳號</h1>

      <AuthInputContainer>
        <AuthInput
          label="帳號"
          placeholder="請輸入帳號"
          value={userName}
          onChange={(userNameInputValue) => setUserName(userNameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="email"
          label="Email"
          placeholder="請輸入Email"
          value={userEmail}
          onChange={(userEmailInputValue) => setUserEmail(userEmailInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="password"
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>註冊</AuthButton>
      <Link to="/login">
        <AuthLinkText>取消</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default SignUpPage;
