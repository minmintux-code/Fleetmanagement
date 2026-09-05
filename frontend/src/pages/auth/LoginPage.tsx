import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      showToast('Successfully authenticated to Fleet Master', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Failed to authenticate. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0] dark:bg-[#120B08] px-4 py-12 transition-colors duration-300 relative overflow-hidden">
      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C87A38]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#B36423]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="max-w-md w-full glass-modal rounded-2xl border border-slate-200/90 dark:border-[#382218] overflow-hidden shadow-2xl z-10"
      >
        {/* Header Branding */}
        <div className="p-8 text-center border-b border-slate-200/80 dark:border-[#382218] bg-slate-50/60 dark:bg-[#1A110C]/80 flex flex-col items-center justify-center">
          <Logo size="lg" showText={true} className="justify-center" />
          <p className="text-xs font-semibold text-slate-500 dark:text-[#A39185] mt-3 uppercase tracking-wider">
            Commercial Logistics & Operations Platform
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Admin Access Key ID"
              type="text"
              placeholder="e.g. Admin123"
              error={errors.adminId?.message as string}
              {...register('adminId')}
            />

            <Input
              label="Fleet Workspace Username"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-600 dark:text-[#C5B7AE] font-medium">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 dark:border-[#382218] text-[#C87A38] focus:ring-[#C87A38] mr-2 accent-[#C87A38]"
                  {...register('rememberMe')}
                />
                Keep session logged in
              </label>
              <a href="#forgot" className="text-[#C87A38] hover:text-[#B36423] hover:underline font-bold">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full text-xs font-bold py-3 glow-accent"
              isLoading={isSubmitting}
            >
              Sign In to Fleet Master
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

