import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { User, Lock, Loader, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

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
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-primary relative animate-fadeIn">
        {/* Back Option */}
        <button onClick={() => navigate('/')} className="absolute top-4 right-4 text-xs font-bold text-gray-500 hover:text-primary transition-colors">
            &larr; Back to Home
        </button>

        <div className="text-center mb-6">
           <h1 className="text-3xl font-bold text-primary">Smart Institute</h1>
           <p className="text-gray-500 text-sm mt-1">Authentic Login Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Role</label>
            <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-gray-50"
                {...register('role', { required: 'Please select a role' })}
            >
                <option value="">-- Select Role --</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Counselor">Counselor</option>
                <option value="Faculty">Faculty</option>
                <option value="Student">Student</option>
            </select>
            {errors.role && <span className="text-xs text-red-500 mt-1">{errors.role.message}</span>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username or Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Email or Username"
                {...register('email', { required: 'Username/Email is required' })}
              />
            </div>
            {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
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
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-primary hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all transform hover:scale-[1.02]"
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : 'Secure Login'}
          </button>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
                {/* Don't have an account?{' '}
                <span 
                    onClick={() => navigate('/register-admin-zyx')} 
                    className="text-primary font-bold cursor-pointer hover:underline"
                >
                    Register Now
                </span> */}
            </p>
        </div>

        <div className="mt-4 text-center text-[10px] text-gray-400">
          From Smart Institute
        </div>
      </div>
    </div>
  );
};

export default LoginPage;