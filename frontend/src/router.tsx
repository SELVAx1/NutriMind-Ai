import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { LandingPage } from '@/pages/LandingPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AIIntelligencePage } from '@/pages/AIIntelligencePage'
import { TrackerPage } from '@/pages/TrackerPage'
import { FoodLogPage } from '@/pages/FoodLogPage'
import { FoodAnalyzePage } from '@/pages/FoodAnalyzePage'
import { AuditTrailPage } from '@/pages/AuditTrailPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { ProgressPage } from '@/pages/ProgressPage'
import { SafetyAuditorPage } from '@/pages/SafetyAuditorPage'
import { SymptomLogPage } from '@/pages/SymptomLogPage'
import { ChatPage } from '@/pages/ChatPage'
import { ClinicalProfilePage } from '@/pages/ClinicalProfilePage'
import { GroceryPage } from '@/pages/GroceryPage'
import { NutriTwinPage } from '@/pages/NutriTwinPage'
import { NutritionistPage } from '@/pages/NutritionistPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { index: true, element: <Navigate to="/auth/login" replace /> },
    ],
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [{
    element: <AppShell />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/overview', element: <Navigate to="/dashboard" replace /> },
      { path: '/intelligence', element: <AIIntelligencePage /> },
      { path: '/food', element: <TrackerPage /> },
      { path: '/food/log', element: <FoodLogPage /> },
      { path: '/food/analyze', element: <FoodAnalyzePage /> },
      { path: '/audit', element: <AuditTrailPage /> },
      { path: '/planner', element: <PlannerPage /> },
      { path: '/progress', element: <ProgressPage /> },
      { path: '/safety', element: <SafetyAuditorPage /> },
      { path: '/symptoms', element: <SymptomLogPage /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/profile', element: <ClinicalProfilePage /> },
      { path: '/nutritwin', element: <NutriTwinPage /> },
      { path: '/grocery', element: <GroceryPage /> },
      { path: '/nutritionist', element: <NutritionistPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  }],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
