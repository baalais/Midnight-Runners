// utils/fetchBlogs.ts
export const fetchBlogs = async () => {
  try {
    const response = await fetch("https://www.midnightrunners.club/_functions/blogPosts");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};
