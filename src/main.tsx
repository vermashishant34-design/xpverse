import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import "./styles.css";

import Landing from "./pages/Landing";
import Character from "./pages/Character";
import Dashboard from "./pages/Dashboard";
import Achievements from "./pages/Achievements";
import AI from "./pages/AI";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Quests from "./pages/Quests";
import Skills from "./pages/Skills";
import { AppShell } from "@/components/AppShell";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/character",
    element: <Character />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/achievements",
        element: <Achievements />,
      },
      {
        path: "/ai",
        element: <AI />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/quests",
        element: <Quests />,
      },
      {
        path: "/skills",
        element: <Skills />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster theme="dark" position="top-right" />
    </QueryClientProvider>
  </StrictMode>
);
