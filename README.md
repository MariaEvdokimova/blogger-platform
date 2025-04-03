# Blogger Platform

- Uses basic authtorization
- express-validator

## API Swagger
/ht_02/api

This project uses **[pnpm](https://pnpm.io/)** as the package manager.

## Scripts

- **`pnpm run watch`**  
  Compiles TypeScript files from the `src` folder to the `dist` folder in **watch mode** (`-w`). This means the compiler will automatically recompile files when they are modified.

- **`pnpm run dev`**  
  Launches the application using **nodemon**, which watches for changes in the compiled code in the `dist` folder and automatically restarts the application when changes are detected. It also enables debugging with the `--inspect` flag.

- **`pnpm run jest`**  
  Runs tests using **Jest**. The `-i` flag ensures that Jest runs tests in **interactive mode** to keep watching for changes and run tests as you modify your code.

- **`pnpm run lint`**  
  Runs **ESLint** to check your code for potential issues and automatically fixes them where possible. This helps maintain consistent code quality.

- **`pnpm run format`**  
  Runs **Prettier** to format your code according to the project’s coding style.
  