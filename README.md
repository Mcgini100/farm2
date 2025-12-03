# FarmSmart Zimbabwe 🚜

A comprehensive, offline-first Progressive Web Application (PWA) designed to help Zimbabwean SME farmers manage their finances, tasks, and weather planning.

## Features 🌟

*   **💰 Finance Manager**:
    *   **Smart Categorization**: Type "Sold 50 cabbages for $20" and it automatically logs it as **Income** / **Sales**.
    *   **Cash Flow Bar**: Visual monthly summary of Income vs. Expenses on the dashboard.
    *   **Offline Storage**: All data is stored locally on your device.

*   **✅ Task Manager**:
    *   **Today's Focus**: See urgent tasks right on the home screen.
    *   **Smart Shortcuts**: Quickly add tasks with auto-opening forms.
    *   **Categories**: Organize by Crop, Livestock, or General.

*   **🌦️ Weather Station**:
    *   **Real-time Forecasts**: Integrated with OpenWeatherMap API.
    *   **Farming Advice**: Get daily recommendations based on the weather (e.g., "Good day for spraying").
    *   **Offline Caching**: Weather data is saved for 7 days so it works even without data.

*   **📈 Market Prices Tracker**:
    *   Track local market prices (e.g., "Maize: $5/bucket").
    *   Monitor price trends over time.

*   **📱 Offline-First PWA**:
    *   Installable on mobile phones.
    *   Works completely offline (syncs weather when online).

## Tech Stack 🛠️

*   **Frontend**: React + TypeScript + Vite
*   **Styling**: Tailwind CSS
*   **Database**: Dexie.js (IndexedDB wrapper)
*   **Icons**: Lucide React
*   **PWA**: Vite PWA Plugin

## Getting Started 🚀

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Deployment 🌍

This app is ready for deployment on **Vercel** or **Netlify**.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel/Netlify.
3.  The build settings will be auto-detected (`npm run build`, `dist` folder).

## License 📄

MIT License. Built for the farmers of Zimbabwe.
