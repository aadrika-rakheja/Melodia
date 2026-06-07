import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../features/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Clear errors when navigating away/mounting
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect on successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/explore');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex antialiased bg-[#101419] font-body text-body-md relative overflow-hidden select-none">
      <div className="flex-1 flex flex-col lg:flex-row w-full h-screen overflow-hidden">
        {/* Left Side: Immersive Visual */}
        <div className="hidden lg:flex flex-1 relative w-full h-full bg-[#0a0e13] overflow-hidden items-center justify-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
            }}
          ></div>
          {/* Atmospheric Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#101419] via-[#101419]/80 to-transparent"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#101419] via-transparent to-transparent"></div>

          {/* Branding Content */}
          <div className="relative z-20 flex flex-col items-start px-container-padding-desktop max-w-2xl mt-auto pb-32">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#d2bbff] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                graphic_eq
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface font-bold">Melodia</h1>
            </Link>
            <p className="font-headline-sm text-headline-sm text-on-surface-variant mb-4">
              Premium Audio, Immersive Experience.
            </p>
            <p className="font-body-md text-body-md text-surface-tint max-w-md">
              Step into a world of high-fidelity sound designed for the sophisticated listener. Your late-night studio
              awaits.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="flex-1 flex flex-col justify-center px-container-padding-mobile sm:px-12 lg:px-24 bg-[#101419] relative overflow-y-auto">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-12 mt-8">
            <span className="material-symbols-outlined text-[#7c3aed] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              graphic_eq
            </span>
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold">Melodia</h1>
          </div>

          <div className="w-full max-w-md mx-auto glass-panel p-8 sm:p-10 rounded-xl relative z-10">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Welcome Back</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Sign in to continue to your music library.</p>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="bg-error-container/30 border border-error/20 text-[#ffdad6] rounded-xl px-4 py-3 text-xs mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">error</span>
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">mail</span>
                  </div>
                  <input
                    className="glow-input w-full bg-surface-container-low border border-surface-variant text-on-surface font-body-md rounded-lg pl-10 pr-4 py-3 focus:ring-0 focus:outline-none transition-colors"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <a className="font-label-sm text-label-sm text-[#7c3aed] hover:text-[#9c63ff] transition-colors" href="#">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
                  </div>
                  <input
                    className="glow-input w-full bg-surface-container-low border border-surface-variant text-on-surface font-body-md rounded-lg pl-10 pr-10 py-3 focus:ring-0 focus:outline-none transition-colors"
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-surface-variant bg-surface-container-low text-[#7c3aed] focus:ring-[#7c3aed] focus:ring-offset-[#101419]"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                <label className="ml-2 block font-body-sm text-body-sm text-on-surface-variant" htmlFor="remember-me">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  className="btn-primary w-full flex justify-center py-3.5 px-4 rounded-full font-label-md text-label-md uppercase tracking-wider text-white shadow-lg disabled:opacity-50 disabled:pointer-events-none"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Log In'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Don't have an account?{' '}
                <Link className="font-semibold text-[#7c3aed] hover:text-[#9c63ff] transition-colors" to="/signup">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Ambient Glow behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#7c3aed]/5 rounded-full blur-[100px] pointer-events-none z-[-1]"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
