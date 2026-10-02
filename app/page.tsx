"use client"

import { useState } from "react"
import SplashScreen from "@/components/screens/splash-screen"
import OnboardingScreen from "@/components/screens/onboarding-screen"
import LoginScreen from "@/components/screens/login-screen"
import RegisterScreen from "@/components/screens/register-screen"
import DashboardScreen from "@/components/screens/dashboard-screen"
import CreditsScreen from "@/components/screens/credits-screen"
import CalculatorScreen from "@/components/screens/calculator-screen"
import ProfileScreen from "@/components/screens/profile-screen"
import EditProfileScreen from "@/components/screens/edit-profile-screen"
import ChangePasswordScreen from "@/components/screens/change-password-screen"
import TermsScreen from "@/components/screens/terms-screen"
import RecoverAccountScreen from "@/components/screens/recover-account-screen"
import AccountSelectionScreen from "@/components/screens/account-selection-screen"
import ApprovalsScreen from "@/components/screens/approvals-screen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<
    | "splash"
    | "onboarding"
    | "login"
    | "register"
    | "dashboard"
    | "credits"
    | "calculator"
    | "profile"
    | "edit-profile"
    | "change-password"
    | "terms"
    | "recover"
    | "account-selection"
    | "approvals"
  >("splash")
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    businessName: "TESTQA YAMI",
    phone: "5544751581",
  })
  const [previousScreen, setPreviousScreen] = useState<string>("dashboard")

  const handleNavigate = (screen: string) => {
    // Si navegamos a account-selection desde profile, guardar que venimos del perfil
    if (screen === "account-selection" && currentScreen === "profile") {
      setPreviousScreen("profile")
    }
    setCurrentScreen(screen as any)
  }

  const handleLogin = (email: string, password: string) => {
    setUserData({ ...userData, email })
    // Si el usuario es ybridon@latamautos.com, mostrar pantalla de selección de cuenta
    if (email === "ybridon@latamautos.com") {
      setCurrentScreen("account-selection")
    } else {
      setCurrentScreen("dashboard")
    }
  }

  const handleSelectAccount = (accountName: string) => {
    setUserData({ ...userData, businessName: accountName })
    // Siempre navegar al dashboard después de seleccionar una cuenta
    setCurrentScreen("dashboard")
    setPreviousScreen("dashboard") // Resetear para la próxima vez
  }

  const handleRegister = (data: any) => {
    setUserData({ ...userData, ...data })
    setCurrentScreen("dashboard")
  }

  const handleUpdateProfile = (data: { name: string; email: string; phone: string }) => {
    setUserData((prev) => ({ ...prev, ...data }))
  }

  return (
    <div className="h-screen w-screen bg-[#F0F7FA] overflow-hidden">
      {/* iPhone frame for development */}
      <div className="h-full w-full max-w-md mx-auto bg-white shadow-2xl shadow-[#020617]/15 flex flex-col relative rounded-[40px] overflow-hidden">
        {/* Screen content */}
        <div className="flex-1 overflow-hidden relative">
          {currentScreen === "splash" && <SplashScreen onNavigate={handleNavigate} />}
          {currentScreen === "onboarding" && <OnboardingScreen onNavigate={handleNavigate} />}
          {currentScreen === "login" && <LoginScreen onNavigate={handleNavigate} onLogin={handleLogin} />}
          {currentScreen === "register" && <RegisterScreen onNavigate={handleNavigate} onRegister={handleRegister} />}
          {currentScreen === "dashboard" && <DashboardScreen onNavigate={handleNavigate} userData={userData} />}
          {currentScreen === "credits" && <CreditsScreen onNavigate={handleNavigate} userData={userData} />}
          {currentScreen === "calculator" && <CalculatorScreen onNavigate={handleNavigate} />}
          {currentScreen === "profile" && <ProfileScreen onNavigate={handleNavigate} userData={userData} />}
          {currentScreen === "edit-profile" && (
            <EditProfileScreen onNavigate={handleNavigate} initialData={userData} onSave={handleUpdateProfile} />
          )}
          {currentScreen === "change-password" && <ChangePasswordScreen onNavigate={handleNavigate} />}
          {currentScreen === "terms" && <TermsScreen onNavigate={handleNavigate} />}
          {currentScreen === "recover" && <RecoverAccountScreen onNavigate={handleNavigate} />}
          {currentScreen === "account-selection" && (
            <AccountSelectionScreen onNavigate={handleNavigate} onSelectAccount={handleSelectAccount} userData={userData} />
          )}
          {currentScreen === "approvals" && <ApprovalsScreen onNavigate={handleNavigate} userData={userData} />}
        </div>

        {/* Home indicator */}
        <div className="bg-[#020617] h-1 rounded-full mx-auto w-32 mb-1"></div>
      </div>
    </div>
  )
}
