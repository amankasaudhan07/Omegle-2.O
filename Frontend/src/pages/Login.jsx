import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Camera } from 'lucide-react';
import { server } from '../constants/config';
import { userExists } from '../redux/reducers/auth';
import Navbar from '../components/specific/Navbar';
import { useTheme } from '../components/layout/ThemeProvider';

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

  const { isDarkMode } = useTheme();

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Logging In...');
    setIsLoading(true);

    try {
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
      <Navbar />
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div
          className="w-full max-w-md rounded-[28px] border p-8 shadow-md"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <h2 className="mb-6 text-center text-2xl font-bold">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <form onSubmit={isLogin ? handleLogin : handleSignUp}>
            {!isLogin && (
              <>
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <img
                    src={avatar.preview || '/api/placeholder/128/128'}
                    className="h-full w-full rounded-full border-4 object-cover"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <label
                    className="absolute bottom-0 right-0 cursor-pointer rounded-full p-2"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                   <Camera
                      className="h-5 w-5"
                      style={{ color: isDarkMode ? "black" : "white" }}
                    />
                    <input
                      type="file"
                      className="hidden"
                      onChange={avatar.changeHandler}
                      accept="image/*"
                    />
                  </label>
                </div>
                {avatar.error && (
                  <p className="mt-1 text-xs text-red-500">{avatar.error}</p>
                )}
                <input
                  className="mb-4 w-full rounded-xl border p-3"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                  type="text"
                  placeholder="Name"
                  value={name.value}
                  onChange={name.changeHandler}
                  required
                />
                <input
                  className="mb-4 w-full rounded-xl border p-3"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
                  type="text"
                  placeholder="Bio"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  required
                />
              </>
            )}
            <input
              className="mb-4 w-full rounded-xl border p-3"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
              type="text"
              placeholder="Username"
              value={username.value}
              onChange={username.changeHandler}
              required
            />
            {username.error && (
              <p className="mb-4 mt-1 text-xs text-red-500">{username.error}</p>
            )}
            <input
              className="mb-6 w-full rounded-xl border p-3"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
              type="password"
              placeholder="Password"
              value={password.value}
              onChange={password.changeHandler}
              required
            />
            <button
              className="w-full rounded-2xl p-3 text-white transition duration-300 disabled:opacity-50"
              style={{ backgroundColor: "var(--brand)" }}
              type="submit"
              disabled={isLoading}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              className="font-medium"
              style={{ color: "var(--brand)" }}
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
