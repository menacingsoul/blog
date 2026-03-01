"use client";

import React, { useState, useEffect } from "react";
import { fetchNotifications, markNotificationsRead } from "@/utils/api";
import { Bell, MessageSquare, Heart, Users, Check, CheckCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Notification } from "@/types";

const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "reply": return <MessageSquare size={16} className="text-blue-400" />;
    case "comment": return <MessageSquare size={16} className="text-purple-400" />;
    case "like": return <Heart size={16} className="text-red-400" />;
    case "follow": return <Users size={16} className="text-green-400" />;
    default: return <Bell size={16} className="text-gray-400" />;
  }
};

const NotificationsClient = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications(50, 0);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) { console.error("Error loading notifications:", error); }
    finally { setLoading(false); }
  };

  const handleMarkAllRead = async () => {
    try { await markNotificationsRead(); setNotifications(prev => prev.map(n => ({ ...n, read: true }))); setUnreadCount(0); }
    catch (error) { console.error("Error marking all read:", error); }
  };

  const handleMarkRead = async (id: string) => {
    try { await markNotificationsRead([id]); setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); setUnreadCount(prev => Math.max(0, prev - 1)); }
    catch (error) { console.error("Error marking read:", error); }
  };

  const formatTime = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bell size={28} /> Notifications
              {unreadCount > 0 && <span className="bg-red-500 text-white text-sm font-bold rounded-full px-2.5 py-0.5">{unreadCount}</span>}
            </h1>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No notifications yet</p>
            <p className="text-sm mt-1">When someone interacts with your content, you&apos;ll see it here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notification => (
              <div key={notification.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${notification.read ? "bg-gray-900/40 border-gray-800" : "bg-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/30"}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5"><NotificationIcon type={notification.type} /></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? "text-gray-400" : "text-white"}`}>{notification.message}</p>
                    {notification.blog && (
                      <Link href={`/blog/viewer/${notification.blog.id}`} className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 inline-block truncate max-w-full">
                        {notification.blog.title}
                      </Link>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
                  </div>
                  {!notification.read && (
                    <button onClick={() => handleMarkRead(notification.id)} className="text-gray-500 hover:text-indigo-400 transition-colors p-1" title="Mark as read">
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsClient;
