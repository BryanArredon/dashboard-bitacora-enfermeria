"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Lock, Mail, ArrowRight } from "lucide-react";
import { Input } from "./src/components/ui/input";
import { Button } from "./src/components/ui/button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-auto p-4"
      >
        <div className="glass-panel p-8 sm:p-10 relative overflow-hidden">

          {/* Subtle glow border at top */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)] border border-white/10"
            >
              <Activity className="w-8 h-8 text-primary-400" />
            </motion.div>

            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-center">
              Bitácora Médica
            </h1>
            <p className="text-slate-400 text-sm text-center">
              Gestión de enfermería avanzada y segura.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  className="pl-11 h-12 text-sm md:text-base bg-white/5 border-white/10 focus:border-primary-500/50 focus:bg-white/10"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  className="pl-11 h-12 text-sm md:text-base bg-white/5 border-white/10 focus:border-primary-500/50 focus:bg-white/10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-background" />
                <span className="text-slate-300">Recordarme</span>
              </label>
              <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button
                type="submit"
                className="w-full h-12 text-base shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Ingresar a la plataforma
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          © {new Date().getFullYear()} UTNG MS Enfermería.
        </p>
      </motion.div>
    </div>
  );
}
