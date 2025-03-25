import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";

const queryClient = new QueryClient();
const rootElement = document.getElementById("root");

if (rootElement) {
    createRoot(rootElement).render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>,
    );
}
