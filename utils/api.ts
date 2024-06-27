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

export const handleVote = async (id: string, voteType: 'upvote' | 'downvote') => {
  try {
    const res = await fetch(createURL(`/api/blog/${id}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: voteType }),
    });

    if (!res.ok) {
      throw new Error('Failed to handle vote');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error handling vote:', error);
    throw error;
  }
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