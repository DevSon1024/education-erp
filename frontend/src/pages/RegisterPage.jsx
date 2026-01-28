import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { User, Lock, Shield, Loader, Eye, EyeOff, AtSign, CheckCircle, XCircle } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [checkingUsername, setCheckingUsername] = React.useState(false);
  const [usernameAvailable, setUsernameAvailable] = React.useState(null);
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const watchUsername = watch('username');

  // Check username availability with debounce
  useEffect(() => {
    if (!watchUsername || watchUsername.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const checkUsername = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check-username/${watchUsername}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setUsernameAvailable(data.available);
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(checkUsername);
  }, [watchUsername]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-green-600 relative animate-fadeIn">
        {/* Back Option */}
        <button onClick={() => navigate('/')} className="absolute top-4 right-4 text-xs font-bold text-gray-500 hover:text-green-600 transition-colors">
            &larr; Back to Home
        </button>

        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-gray-800">Admin Setup</h1>
           <p className="text-gray-500 text-sm mt-1">Create your first Super Admin account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Prince Chaubey"
                {...register('name', { required: 'Name is required' })}
              />
            </div>
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                  errors.username ? 'border-red-500' : 
                  usernameAvailable === false ? 'border-red-500' : 
                  usernameAvailable === true ? 'border-green-500' : 'border-gray-300'
                }`}
                placeholder="admin_user123"
                {...register('username', { 
                  required: 'Username is required',
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: 'Only letters, numbers, underscore and dash allowed'
                  },
                  minLength: { value: 3, message: 'Minimum 3 characters required' },
                  validate: () => {
                    if (usernameAvailable === false) {
                      return 'Username already taken';
                    }
                    return true;
                  }
                })}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {checkingUsername && <Loader size={18} className="text-gray-400 animate-spin" />}
                {!checkingUsername && usernameAvailable === true && <CheckCircle size={18} className="text-green-500" />}
                {!checkingUsername && usernameAvailable === false && <XCircle size={18} className="text-red-500" />}
              </div>
            </div>
            {errors.username && <span className="text-xs text-red-500 mt-1">{errors.username.message}</span>}
            {!errors.username && usernameAvailable === false && <span className="text-xs text-red-500 mt-1">Username already taken</span>}
            {!errors.username && usernameAvailable === true && <span className="text-xs text-green-500 mt-1">Username available!</span>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield size={18} className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                {...register('role', { required: true })}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Branch Admin">Branch Admin</option>
                <option value="Employee">Employee</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
           <Link to="/login" className="text-green-600 hover:underline font-medium">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;