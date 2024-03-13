import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200')
})

test('should render input and add a new ToDo', async ({ page }) => {
  await expect(page.getByLabel('Add a task')).toBeVisible()

  await page.getByLabel('Add a task').fill('Task 1')
  await page.getByLabel('Add a task').press('Enter')

  await page.getByLabel('Add a task').fill('Task 2')
  await page.getByLabel('Add a task').press('Enter')

  expect((await page.locator('todo-item').all()).length).toBe(2)
  expect(await page.locator('todo-item').first().textContent()).toContain(
    'Task 1'
  )
})

test('should add To Do with date', async ({ page }) => {
  await page.getByLabel('Choose a date').fill('1/2/2024')
  await page.getByLabel('Add a task').fill('Task 1')
  await page.keyboard.press('Enter')

  expect(await page.locator('todo-item').first().textContent()).toContain(
    '2024'
  )
})

test('should add a subTask', async ({ page }) => {
  await expect(page.getByLabel('Add a task')).toBeVisible()

  await page.getByLabel('Add a task').fill('Task 1')
  await page.getByLabel('Add a task').press('Enter')

  await page.getByText('Task 1').hover()

  await page
    .locator('.container__menu')
    .first()
    .getByRole('button', { name: 'Add subtask' })
    .click()

  await page.locator("todo-item input[name='taskInput']").fill('Subtask 1')
  await page.keyboard.press('Enter')

  await page.getByText('Task 1', { exact: true }).hover()

  await page
    .locator('.container__menu')
    .first()
    .getByRole('button', { name: 'Add subtask' })
    .click()

  await expect(page.locator("todo-item input[name='taskInput']")).toBeHidden()

  await expect(page.getByText('Subtask 1', { exact: true })).toBeVisible()
})

test('should delete a To Do', async ({ page }) => {
  await expect(page.getByLabel('Add a task')).toBeVisible()

  await page.getByLabel('Add a task').fill('Task 1')
  await page.getByLabel('Add a task').press('Enter')

  await page.getByText('Task 1').hover()

  await page.getByRole('button', { name: 'Delete task' }).click()

  await expect(page.getByText('Task 1')).toBeHidden()
})

test('should delete a subTask', async ({ page }) => {
  await expect(page.getByLabel('Add a task')).toBeVisible()

  await page.getByLabel('Add a task').fill('Task 1')
  await page.getByLabel('Add a task').press('Enter')

  await page.getByText('Task 1').hover()

  await page
    .locator('.container__menu')
    .first()
    .getByRole('button', { name: 'Add subtask' })
    .click()

  await page.locator("todo-item input[name='taskInput']").fill('Subtask 1')
  await page.keyboard.press('Enter')

  expect(await page.getByText('Subtask 1', { exact: true }).count()).toBe(1)

  await page.getByText('Subtask 1', { exact: true }).hover()
  await page.getByRole('button', { name: 'Delete task' }).click()

  expect(await page.getByText('Subtask 1', { exact: true }).count()).toBe(0)
  await expect(page.getByText('Task 1')).toBeVisible()
})
