import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { FoodLogPage } from '@/pages/FoodLogPage'
import { FoodAnalyzePage } from '@/pages/FoodAnalyzePage'
import { TrackerPage } from '@/pages/TrackerPage'
import { ChatPage } from '@/pages/ChatPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { GroceryPage } from '@/pages/GroceryPage'
import { NutriTwinPage } from '@/pages/NutriTwinPage'
import { NutritionistPage } from '@/pages/NutritionistPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/onboarding',
    element: <ProtectedRoute><OnboardingPage /></ProtectedRoute>,
  },
  {
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/food', element: <FoodLogPage /> },
      { path: '/food/analyze', element: <FoodAnalyzePage /> },
      { path: '/tracker', element: <TrackerPage /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/planner', element: <PlannerPage /> },
      { path: '/grocery', element: <GroceryPage /> },
      { path: '/nutritwin', element: <NutriTwinPage /> },
      { path: '/nutritionist', element: <NutritionistPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
