import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import "./i18n";
import I18n from "../lib/context/i18n/I18n";

const queryClient = new QueryClient();
const rootElement = document.getElementById("root");

if (rootElement) {
    createRoot(rootElement).render(
        <QueryClientProvider client={queryClient}>
            <I18n>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="*" element={<App />} />
                    </Routes>
                </BrowserRouter>
            </I18n>
        </QueryClientProvider>,
    );
}
