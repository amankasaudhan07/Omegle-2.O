import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Camera } from 'lucide-react';
import { server } from '../constants/config';
import { userExists } from '../redux/reducers/auth';
import Navbar from '../components/specific/Navbar';
// import { usernameValidator } from '../utils/validators';

const useInputValidation = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const changeHandler = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (validator) {
      const validationError = validator(newValue);
      setError(validationError || '');
    }
  };

  return { value, changeHandler, error };
};

const useFileHandler = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const changeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
    } else {
      setError('Please select a valid file');
    }
  };

  return { file, preview, changeHandler, error };
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const name = useInputValidation('');
  const bio = useInputValidation('');
  const username = useInputValidation('');
  const password = useInputValidation('');
  const avatar = useFileHandler("single");

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Logging In...');
    setIsLoading(true);

    try {
<<<<<<< HEAD
      console.log(server);
=======
       console.log(server);
>>>>>>> 53d5fde00fddabc71e1a8aead831a8cc4bd98008
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { username: username.value, password: password.value },
        { withCredentials: true }
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something Went Wrong', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Signing Up...');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('avatar', avatar.file);
    formData.append('name', name.value);
    formData.append('bio', bio.value);
    formData.append('username', username.value);
    formData.append('password', password.value);

    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something Went Wrong', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
     <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-600">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          {!isLogin && (
            <>
              <div className="mb-4 relative w-32 h-32 mx-auto">
                <img
                  src={avatar.preview || '/api/placeholder/128/128'}
                  // alt="avatar"
                  className="border-4  w-full h-full rounded-full object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={avatar.changeHandler}
                    accept="image/*"
                  />
                </label>
              </div>
              {avatar.error && (
                <p className="text-red-500 text-xs mt-1">{avatar.error}</p>
              )}
              <input
                className="w-full p-2 border rounded mb-4"
                type="text"
                placeholder="Name"
                value={name.value}
                onChange={name.changeHandler}
                required
              />
              <input
                className="w-full p-2 border rounded mb-4"
                type="text"
                placeholder="Bio"
                value={bio.value}
                onChange={bio.changeHandler}
                required
              />
            </>
          )}
          <input
            className="w-full p-2 border rounded mb-4"
            type="text"
            placeholder="Username"
            value={username.value}
            onChange={username.changeHandler}
            required
          />
          {username.error && (
            <p className="text-red-500 text-xs mt-1 mb-4">{username.error}</p>
          )}
          <input
            className="w-full p-2 border rounded mb-6"
            type="password"
            placeholder="Password"
            value={password.value}
            onChange={password.changeHandler}
            required
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-blue-500 hover:underline"
            onClick={toggleLogin}
            disabled={isLoading}
          >
            {isLogin ? 'Sign Up Instead' : 'Login Instead'}
          </button>
        </div>
      </div>
    </div>

    </>
  );
};

export default Login;
