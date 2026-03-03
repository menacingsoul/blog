"use client";

import React, { useState, useEffect } from "react";
import { fetchNotifications, markNotificationsRead } from "@/utils/api";
import { Bell, MessageSquare, Heart, Users, Check, CheckCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Notification } from "@/types";
import { cn } from "@/lib/utils";
import Loading from "../Loading";

const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "reply": return <MessageSquare size={16} className="text-blue-500" />;
    case "comment": return <MessageSquare size={16} className="text-primary" />;
    case "like": return <Heart size={16} className="text-rose-500" />;
    case "follow": return <Users size={16} className="text-emerald-500" />;
    default: return <Bell size={16} className="text-muted-foreground" />;
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
      <Loading />
    );
  }


  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Bell size={28} className="text-primary" /> Notifications
              {unreadCount > 0 && <span className="bg-destructive text-destructive-foreground text-sm font-bold rounded-full px-2.5 py-0.5">{unreadCount}</span>}
            </h1>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground glass-card rounded-2xl">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No notifications yet</p>
            <p className="text-sm mt-1">When someone interacts with your content, you&apos;ll see it here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notification => (
              <div key={notification.id}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200",
                  notification.read
                    ? "bg-card/50 border-border"
                    : "glass-card bg-primary/5 border-primary/20 hover:border-primary/30"
                )}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-full bg-muted/50"><NotificationIcon type={notification.type} /></div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", notification.read ? "text-muted-foreground" : "text-foreground")}>{notification.message}</p>
                    {notification.blog && (
                      <Link href={`/blog/viewer/${notification.blog.id}`} className="text-xs text-primary hover:text-primary/80 mt-1 inline-block truncate max-w-full">
                        {notification.blog.title}
                      </Link>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.createdAt)}</p>
                  </div>
                  {!notification.read && (
                    <button onClick={() => handleMarkRead(notification.id)} className="text-muted-foreground hover:text-primary transition-colors p-1" title="Mark as read">
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
