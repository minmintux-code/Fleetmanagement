import React, { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { Bell, CheckCheck, AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const notifCtx = useContext(NotificationContext);
  if (!isOpen || !notifCtx) return null;

  const { notifications, markAsRead, markAllAsRead } = notifCtx;

  const iconMap = {
    ERROR: <AlertCircle className="w-4 h-4 text-red-600" />,
    WARNING: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    SUCCESS: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    INFO: <Info className="w-4 h-4 text-blue-600" />,
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-white shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4" />
          <h4 className="text-sm font-semibold">Notifications</h4>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-300 hover:text-white flex items-center transition-colors"
            title="Mark all as read"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1" /> Read All
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">No notifications right now.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                !n.isRead ? 'bg-blue-50/40 font-medium' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">{iconMap[n.type]}</div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{n.title}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                {n.linkUrl && (
                  <Link
                    to={n.linkUrl}
                    onClick={onClose}
                    className="inline-block mt-1 text-[11px] text-blue-600 font-semibold hover:underline"
                  >
                    View Details &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          See All Notification History
        </Link>
      </div>
    </div>
  );
};
