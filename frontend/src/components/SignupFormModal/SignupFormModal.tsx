import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkSignup } from '../../redux/session';
import { FaUserCircle } from 'react-icons/fa';
import LoginFormModal from '../LoginFormModal';
import './SignupForm.css';

interface ISignUpErrors {
  server?: any;
  firstName?: string,
  lastName?: string,
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function SignupFormModal() {
  const dispatch = useDispatch();
  const { setModalContent}=useModal()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ISignUpErrors>({
    server: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { closeModal } = useModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword: 'Confirm Password field must be the same as the Password field',
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        firstName,
        lastName,
        username,
        email,
        password,
      }),
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="sign-up-modal-div">
      <FaUserCircle style={{ color: '#7d7a85' }} className="profile-pic" />
    
      <form onSubmit={handleSubmit} className="sign-up-form">
        <h1>Welcome To OneMusic</h1>
        <h3>The service that lets you transfer all of your playlists across streaming services.</h3>
        <button className="signup-button"onClick={(e)=>{
          setModalContent(<LoginFormModal/>)
        }}>Already a user?</button>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        {errors.email && <p>{errors.email}</p>}
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        {errors.username && <p>{errors.username}</p>}

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
          required
        />

        {errors.password && <p>{errors.password}</p>}
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button className="signup-submit" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;

