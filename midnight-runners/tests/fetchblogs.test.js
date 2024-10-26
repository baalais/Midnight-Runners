/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { test, expect } from '@playwright/test';
import { fetchBlogs } from '../src/utils/fetchBlogs';

test.describe('fetchBlogs function tests', () => {
  test('should return blog posts with title and content successfully',
async ({ page }) => {
    // Mock the API response with additional fields
    await page.route('https://www.midnightrunners.club/_functions/blogPosts',
route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          items: [
            {
              _id: '123',
              slug: 'Blog 1',
              plainContent: 'Content for blog 1',
            },
            {
              _id: '456',
              slug: 'Blog 2',
              plainContent: 'Content for blog 2',
            }
          ]
        })
      });
    });

    // Call the fetchBlogs function
    const blogs = await fetchBlogs();

    // Check if each blog post contains title and content
    blogs.forEach(blog => {
      expect(blog).toHaveProperty('slug');
      expect(blog).toHaveProperty('plainContent');
    });
  });
});