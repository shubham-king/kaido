import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Import App component
import { QueryClientProvider, QueryClient } from "react-query"; // Import React Query
import { ReactQueryDevtools } from "react-query/devtools"; // React Query Devtools
import "./main.css"; // Your custom CSS for global styles
import "./components/AnimeInfo/AnimeInfo.css"; // Additional component-specific CSS

// Create a QueryClient instance
const queryClient = new QueryClient();

// Render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpem={false} position="bottom-right" />
  </QueryClientProvider>
);
