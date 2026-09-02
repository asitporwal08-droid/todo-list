# Daymark Todo List

Daymark is a lightweight, dependency-free todo list for keeping daily tasks visible and manageable. It runs directly in a browser with no build step or backend required.

## Features

- Add new tasks with a timestamp
- Mark tasks complete or incomplete
- Filter tasks by all, open, or done
- Clear completed tasks
- Save tasks automatically in browser `localStorage`
- Responsive layout for desktop and mobile screens

## Run Locally

1. Open [index.html](index.html) in a modern web browser.
2. Add a task using the input at the top of the page.
3. Use the filter tabs to switch between task views.

No dependencies or installation commands are required.

## Project Files

- [index.html](index.html) - Page structure and accessible controls
- [styles.css](styles.css) - Responsive visual design and animations
- [app.js](app.js) - Task state, filtering, persistence, and interactions

## Data Storage

Tasks are stored locally in the browser under the `daymark-tasks` key. They remain available on the same browser and device until the browser's site data is cleared.
