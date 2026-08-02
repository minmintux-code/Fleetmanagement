import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useNotification } from '../hooks/useNotification';
import { User as UserIcon, Shield, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Profile information updated', 'success');
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Account Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account details, security settings, and personal contact information.
        </p>
      </div>

      <Card>
        <div className="flex items-center space-x-4 pb-6 mb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-md">
            {user?.name ? user.name.charAt(0) : <UserIcon className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Administrator'}</h3>
            <p className="text-xs text-slate-500">{user?.email || 'admin@fleetmaster.com'}</p>
            <div className="mt-2 inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              <Shield className="w-3.5 h-3.5 mr-1" /> Role: {user?.role || 'ADMIN'}
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" defaultValue={user?.name || 'Marcus Vance'} />
            <Input label="Email Address" type="email" defaultValue={user?.email || 'admin@fleetmaster.com'} disabled />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Department" defaultValue={user?.department || 'Fleet Operations'} />
            <Input label="Phone Number" defaultValue={user?.phone || '+1 (555) 234-5678'} />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" isLoading={isSubmitting} icon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
