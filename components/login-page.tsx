"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Clock, Users, Calendar, TrendingUp, CheckCircle2, ShieldCheck } from "lucide-react"

export function LoginPage() {
  const [email, setEmail] = useState("sarah.johnson@dayflow.com")
  const [password, setPassword] = useState("password")
  const [role, setRole] = useState<UserRole>("EMPLOYEE")
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-sidebar-primary text-sidebar-primary-foreground p-12 flex-col justify-between">
        
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-150 h-150 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] -left-[10%] w-125 h-125 bg-black/20 rounded-full blur-3xl" />
        </div>

        {/* Brand Content */}
        <div className="relative z-10 animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-white/30">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Dayflow</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Workforce management <br/>
            <span className="text-white/80">reimagined for speed.</span>
          </h1>
          <p className="text-sidebar-primary-foreground/70 text-lg max-w-md leading-relaxed">
            Handle shifts, payroll, and approvals in one unified workspace. Designed for modern teams.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
            {[
                { icon: Users, title: "Team Ops", desc: "Centralized directory" },
                { icon: Calendar, title: "Smart Leave", desc: "One-click approvals" },
                { icon: Clock, title: "Time Tracking", desc: "Geo-fenced clock-ins" },
                { icon: TrendingUp, title: "Analytics", desc: "Real-time insights" }
            ].map((item, idx) => (
                <div key={idx} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                    <div className="p-2 bg-white/10 w-fit rounded-lg mb-3 group-hover:bg-white/20 transition-colors">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                    <p className="text-white/50 text-xs">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* Footer Trust Marker */}
        <div className="relative z-10 flex items-center gap-2 text-white/40 text-sm font-medium pt-8">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Grade Security • SOC2 Compliant</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
      {/* Dot Pattern Background for Right Side */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none opacity-50" />

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center gap-2 mb-8 text-center">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Clock className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Dayflow</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <Card className="border-0 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl ring-1 ring-border">
            <CardHeader className="space-y-1 pb-6 pt-8 px-8">
              <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access the portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    // Using standard input, but rounded via global CSS variable if desired, 
                    // or we can force rounded-full here if your Input component supports it.
                    // Assuming default Input component for now.
                    className="h-11 bg-background/50" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 bg-background/50"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/40 border border-border rounded-xl">
                  <div className="space-y-0.5">
                    <Label htmlFor="admin-toggle" className="text-sm font-medium cursor-pointer">
                      Admin Access
                    </Label>
                    <p className="text-[10px] text-muted-foreground">
                      Toggle for HR privileges
                    </p>
                  </div>
                  <Switch
                    id="admin-toggle"
                    checked={role === "ADMIN"}
                    onCheckedChange={(checked) => setRole(checked ? "ADMIN" : "EMPLOYEE")}
                  />
                </div>

                <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]" 
                    size="lg"
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary cursor-pointer hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}