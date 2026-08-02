import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Truck, ShieldCheck, Lock } from 'lucide-react';
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
      showToast('Successfully authenticated into Fleet Manager', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Failed to authenticate. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-800">
        {/* Header Branding */}
        <div className="p-8 bg-slate-950 text-center border-b border-slate-800 relative">
          <div className="inline-flex p-3 bg-blue-600 rounded-xl text-white shadow-lg mb-3">
            <Truck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">{APP_NAME}</h2>
          <p className="text-xs text-slate-400 mt-1">Enterprise Fleet Operations & Control System</p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Corporate Email Address"
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
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-2"
                  {...register('rememberMe')}
                />
                Remember login session
              </label>
              <a href="#forgot" className="text-blue-600 hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-sm font-semibold shadow-md"
              isLoading={isSubmitting}
              icon={<Lock className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit TLS Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
