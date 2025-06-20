import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { AnyAction } from "redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkGetAllPlaylists } from "../../redux/playlist";


interface IErrors {
  email: string;
  password:string
}

function LoginFormModal():JSX.Element {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<IErrors | AnyAction>({email: "", password: ""});
  const { closeModal } = useModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse.ok) {
      dispatch(thunkGetAllPlaylists())
      closeModal();
    } else {
      setErrors(serverResponse);
    }
  };

  return (
    <div className="login-modal-div">
      <h1>Log In</h1>
      <FaUserCircle style={{ color: '#7d7a85' }} className="profile-pic" />
      <form onSubmit={(e) => handleSubmit(e)} className="login-form">
      
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        {errors.email && <p>{errors.email}</p>}
        
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        {errors.password && <p>{errors.password}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
