import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://final-personal-project-frontend.vercel.app/');
  await page.getByRole('navigation').getByRole('button', { name: 'Hello, sign in' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByPlaceholder('example@gmail.com').click();
  await page.getByPlaceholder('example@gmail.com').fill('gift@gmail.com');
  await page.getByPlaceholder('password').click();
  await page.getByPlaceholder('password').fill('muuo');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.locator('a').filter({ hasText: 'Adventure Tent' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('link', { name: 'Gift\'s Shop' }).click();
  await page.getByRole('link', { name: ' All' }).click();
  await page.getByRole('link', { name: 'Accessories' }).click();
  await page.getByRole('button', { name: 'Admin' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Admin' }).click();
  await page.getByRole('link', { name: 'Products' }).click();
  await page.getByRole('button', { name: 'Admin' }).click();
  await page.getByRole('link', { name: 'Orders' }).first().click();
  await page.getByRole('button', { name: 'Admin' }).click();
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await page.getByRole('link', { name: 'Gift\'s Shop' }).click();
});