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
      cache: 'no-store', // Ensure fetching latest data
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


export const deleteBlog = async (id: String) => {
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

}

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
    return data.message; // Return the success message

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
    return data.message; // Return the success message

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
      throw new Error('Failed to unfollow user');
    }

    const data = await response.json();
    return data.message; // Return the success message

  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw new Error('Error unfollowing user');
  }
};