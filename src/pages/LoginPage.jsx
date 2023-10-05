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
import { checkPermission, login } from '../api/auth';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleClick = async () => {
    if (userName.length === 0) {
      return
    }

    if (password.length === 0) {
      return;
    }

    const { success, authToken } = await login({
      username: userName,
      password,
    });

    if (success) {
      localStorage.setItem('authToken', authToken);

      Swal.fire({
        title: '登入成功',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
        position: 'top'
      });

      navigate('/todos')

      return
    }

    Swal.fire({
      title: '登入失敗',
      icon: 'error',
      showConfirmButton: false,
      timer: 1000,
      position: 'top',
    });
  }

  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        return;
      }

      const result = await checkPermission(authToken);

      if (result) {
        navigate('/todos');
      }
    };

    checkTokenIsValid();
  }, [navigate]);

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

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
          type="password"
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>登入</AuthButton>
      <Link to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
