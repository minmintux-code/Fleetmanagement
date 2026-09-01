import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      adminId: '',
      username: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: { adminId?: string; username?: string; password?: string }) => {
    try {
      await login(data.adminId || '', data.username || '', data.password || '');
      showToast('Successfully authenticated', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Failed to authenticate. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-900 px-4 py-12 transition-colors duration-300">
      <div className="max-w-sm w-full bg-white dark:bg-slate-800 rounded border border-[#E5E7EB] dark:border-slate-700 overflow-hidden shadow-xl animate-fade-in animate-slide-up">
        {/* Header Branding */}
        <div className="p-6 bg-white dark:bg-[#1E293B] text-center border-b border-[#E5E7EB] dark:border-slate-700 flex flex-col items-center justify-center">
          <Logo size="lg" showText={true} className="justify-center" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fleet Management System</p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Admin ID"
              type="text"
              placeholder="e.g. Admin123"
              error={errors.adminId?.message as string}
              {...register('adminId')}
            />

            <Input
              label="Workspace Username"
              type="text"
              placeholder="e.g. Simpson"
              error={errors.username?.message as string}
              {...register('username')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              error={errors.password?.message as string}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  className="rounded border-[#E5E7EB] dark:border-slate-700 text-[#2563EB] focus:ring-[#2563EB] dark:focus:ring-blue-500 mr-1.5"
                  {...register('rememberMe')}
                />
                Remember me
              </label>
              <a href="#forgot" className="text-[#2563EB] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full text-xs font-semibold"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
