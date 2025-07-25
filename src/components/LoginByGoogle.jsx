import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../Redux/Actions';
import showAlert from '../Functions/Alert';


const LoginByGoogle = (props) => {
  const text = props.text || "continue_with";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURI = process.env.REACT_APP_BASE_URI_BACKEND;

  const handleLoginSuccess = async (credentialResponse) => {
    const userObject = jwtDecode(credentialResponse.credential);
    const userInfo = {
      name: userObject.name,
      email: userObject.email,
      dp: userObject.picture,
      googleId: userObject.sub,
      isGoogleUser: true,
    };

    const res = await fetch(`${baseURI}/api/v1/auth/googlelogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });
    const data = await res.json();
    if (res.status === 200) {
      dispatch(setToken(data.auto_token));
      navigate("/questions");
    }
    else {
      showAlert({
        title: data.error ? data.error : data ? data : "Something went wrong",
        icon: "error",
      })
    }
  }
  return (
    <GoogleLogin theme='filled_blue' size='medium' text={text} shape="circle" logo_alignment="center" width="10000"
      onSuccess={(credentialResponse) => handleLoginSuccess(credentialResponse)}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
}

export default LoginByGoogle;
