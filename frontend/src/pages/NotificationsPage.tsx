import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatDateTime } from '../utils/formatters';
import { CheckCheck, AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const notifCtx = useContext(NotificationContext);

  if (!notifCtx) return null;
  const { notifications, markAsRead, markAllAsRead } = notifCtx;

  const iconMap = {
    ERROR: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    WARNING: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    SUCCESS: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    INFO: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Notifications & Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit log of system alerts, dispatch completions, and critical maintenance notices.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            icon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        </div>
      </div>

      <Card padding={false}>
        <div className="divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No notifications found.</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-5 flex items-start space-x-4 transition-colors cursor-pointer hover:bg-slate-50 ${
                  !item.isRead ? 'bg-blue-50/30 font-medium' : ''
                }`}
              >
                <div className="mt-1">{iconMap[item.type]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <span className="text-xs text-slate-400">{formatDateTime(item.timestamp)}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.message}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <Badge size="sm" variant="secondary">
                      {item.category}
                    </Badge>
                    {!item.isRead && <Badge size="sm" variant="info">Unread</Badge>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
