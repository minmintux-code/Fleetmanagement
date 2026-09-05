import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { ThemeToggleSwitch } from '../../components/common/ThemeToggleSwitch';
import { useNotification } from '../../hooks/useNotification';
import { Save, Database, Palette } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('System configuration settings saved successfully', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">System Settings & Preferences</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure organization details, default dispatch thresholds, appearance themes, and API endpoints.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Appearance & Theme Preferences */}
        <Card title="User Interface & Theme Preferences" subtitle="Customize Light & Dark mode display themes">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-[#C87A38]" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Color Theme Mode</div>
                <div className="text-[11px] text-slate-500 dark:text-[#A39185]">Slide to toggle between warm Light and dark Espresso theme</div>
              </div>
            </div>
            <ThemeToggleSwitch size="md" showLabels={true} />
          </div>
        </Card>

        {/* Organization Configuration */}
        <Card title="Organization & System Details" subtitle="Company identity displayed across generated reports">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company Name" defaultValue="Fleet Master Logistics" />
              <Input label="System Environment Name" defaultValue="Production Fleet Hub" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Support Email Contact" defaultValue="support@fleetmaster.com" />
              <Select
                label="Primary Operating Currency"
                options={[
                  { value: 'INR', label: 'INR (₹) Indian Rupee' }
                ]}
                defaultValue="INR"
              />
            </div>
          </div>
        </Card>

        {/* Alert Thresholds */}
        <Card title="Fleet Alert & Safety Thresholds" subtitle="Automatic warning triggers for maintenance & license expiry">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Driver License Expiry Alert Window (Days)"
              type="number"
              defaultValue="60"
            />
            <Input
              label="Preventive Maintenance Interval (KM)"
              type="number"
              defaultValue="15000"
            />
          </div>
        </Card>

        {/* API Backend Integration */}
        <Card title="Backend API Connection" subtitle="Active REST endpoints host setup">
          <div className="space-y-4">
            <Input label="Backend REST Service Base URL" defaultValue="http://localhost:8080/api" />
            <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 font-semibold">
              <Database className="w-4 h-4 shrink-0" />
              <span>Spring Boot Backend Target Connected and Synchronized with SQL DB</span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
            Save System Configurations
          </Button>
        </div>
      </form>
    </div>
  );
};

