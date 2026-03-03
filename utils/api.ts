// utils/api.ts
const createURL = (path: string) => {
  return window.location.origin + path;
};

export const createBlog = async () => {
  try {
    const res = await fetch(createURL('/api/blog'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const errorData = await res.json();
      throw new Error(errorData?.message || 'Failed to create blog');
    }
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const fetchBlog = async (id: string) => {
  try {
    const res = await fetch(createURL(`/api/blog/${id}`), {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch blog');
    }

    const blog = await res.json();
    return blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

export const handleVote = async (blogId: string, voteType: 'upvote' | 'downvote') => {
  const response = await fetch(`/api/vote/blog/${blogId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: voteType }),
  });

  if (!response.ok) {
    throw new Error('Failed to cast vote');
  }

  return response.json();
};

export const addComment = async (id: string, content: string) => {
  try {
    const res = await fetch(createURL(`/api/blog/${id}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'comment', content }),
    });

    if (!res.ok) {
      throw new Error('Failed to add comment');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const addReply = async (blogId: string, content: string, parentId: string) => {
  try {
    const res = await fetch(createURL(`/api/blog/${blogId}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'comment',
        content,
        parentId,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to add reply');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const res = await fetch(createURL(`/api/blog/${id}`), {
      method: 'DELETE',
    });

    if (res.ok) {
      return true;
    } else {
      const errorData = await res.json();
      throw new Error(errorData?.message || 'Failed to delete blog');
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const followUser = async (authorId: string) => {
  try {
    const response = await fetch('/api/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authorId }),
    });

    if (!response.ok) {
      throw new Error('Failed to follow user');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error following user:', error);
    throw new Error('Error following user');
  }
};

export const unFollowUser = async (authorId: string) => {
  try {
    const response = await fetch('/api/unfollow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authorId }),
    });

    if (!response.ok) {
      throw new Error('Failed to unfollow user');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw new Error('Error unfollowing user');
  }
};

export const removeFollower = async (followerId: string) => {
  try {
    const response = await fetch('/api/removefollower', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ followerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove follower');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error removing follower:', error);
    throw new Error('Error removing follower');
  }
};

// ---- NEW API FUNCTIONS ----

export const toggleBookmark = async (blogId: string) => {
  try {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId }),
    });
    if (!response.ok) throw new Error('Failed to toggle bookmark');
    return response.json();
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};

export const fetchBookmarks = async () => {
  try {
    const response = await fetch('/api/bookmarks');
    if (!response.ok) throw new Error('Failed to fetch bookmarks');
    return response.json();
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
};

export const fetchNotifications = async (take = 20, skip = 0) => {
  try {
    const response = await fetch(`/api/notifications?take=${take}&skip=${skip}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationsRead = async (notificationIds?: string[]) => {
  try {
    const response = await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationIds }),
    });
    if (!response.ok) throw new Error('Failed to mark notifications read');
    return response.json();
  } catch (error) {
    console.error('Error marking notifications read:', error);
    throw error;
  }
};

export const toggleCommentLike = async (commentId: string) => {
  try {
    const response = await fetch(`/api/comments/${commentId}/like`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to toggle like');
    return response.json();
  } catch (error) {
    console.error('Error toggling comment like:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete comment');
    return response.json();
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const updateProfile = async (profileData: {
  firstName: string;
  lastName?: string;
  bio: string;
  website?: string;
  city: string;
  country: string;
  profilePhoto?: string;
}) => {
  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }
    return response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const searchBlogs = async (params: {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.category) searchParams.set('category', params.category);
    if (params.tag) searchParams.set('tag', params.tag);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.sort) searchParams.set('sort', params.sort);

    const response = await fetch(`/api/search?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to search blogs');
    return response.json();
  } catch (error) {
    console.error('Error searching blogs:', error);
    throw error;
  }
};

export const recordView = async (blogId: string) => {
  try {
    const response = await fetch(`/api/views/${blogId}`, {
      method: 'POST',
    });
    return response.json();
  } catch (error) {
    console.error('Error recording view:', error);
  }
};