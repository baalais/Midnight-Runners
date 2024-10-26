import { test, expect } from '@playwright/test';
import { fetchBlogs } from '../src/utils/fetchBlogs';

test.describe('fetchBlogs function tests', () => {
  test('should return blog posts with title and content successfully', async ({ page }) => {
    // Mocko API atbildi ar papildus laukiem
    await page.route('https://www.midnightrunners.club/_functions/blogPosts', route => {
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

    // Izsaucam fetchBlogs funkciju
    const blogs = await fetchBlogs();

    // Pārbaudām, vai katrs bloga ieraksts satur virsrakstu un saturu
    blogs.forEach(blog => {
      expect(blog).toHaveProperty('slug');
      expect(blog).toHaveProperty('plainContent');
    });
  });
});
