import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Home } from '@/pages/Home'
import { Profile } from '@/pages/Profile'
import { Spmi } from '@/pages/Spmi'
import { Standar } from '@/pages/Standar'
import { Contact } from '@/pages/Contact'
import { Login } from '@/pages/Login'
import { Admin } from '@/pages/Admin'
import { AuthProvider } from '@/context/AuthContext'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function NotFound() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Halaman yang Anda tuju tidak tersedia di portal ini.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <div className="flex min-h-dvh flex-col">
          <Navbar />
          <ScrollToTop />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/spmi" element={<Spmi />} />
              <Route path="/akreditasi" element={<Standar />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </AuthProvider>
  )
}
