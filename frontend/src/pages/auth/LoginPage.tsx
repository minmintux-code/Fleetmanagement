import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Truck } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

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
      email: 'admin@fleetmaster.com',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await login(data.email);
      showToast('Successfully authenticated', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Failed to authenticate. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="max-w-sm w-full bg-white rounded border border-[#E5E7EB] overflow-hidden">
        {/* Header Branding */}
        <div className="p-6 bg-[#1E293B] text-center border-b border-[#E5E7EB]">
          <div className="inline-flex p-2 bg-[#2563EB] rounded text-white mb-2">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold text-white tracking-tight">{APP_NAME}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Fleet Management System</p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@fleetmaster.com"
              error={errors.email?.message as string}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              error={errors.password?.message as string}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-600">
                <input
                  type="checkbox"
                  className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB] mr-1.5"
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
