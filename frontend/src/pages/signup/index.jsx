import React, { useState, useEffect } from "react";
import { LabelMod } from "../../components/ui/LabelMod";
import { InputMod } from "../../components/ui/InputMod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, loginUser, getUserInfo } from "@/store/feature/auth/authThunk";
import { useRouter } from "next/router";
import { toast } from "sonner";


const DSA_SHEET_PROBLEMS = 368;
const languages = ["python", "java", "c++"];
const dsaSheets = ["apna college dsa sheet"];
const durations = [3, 6, 9, 10, 12];

function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState("signup");
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    language: "python",
    dsaSheet: "apna college dsa sheet",
    duration: 6,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [problemsPerDay, setProblemsPerDay] = useState(
    Math.ceil(DSA_SHEET_PROBLEMS / (form.duration * 30))
  );

  useEffect(() => {
    setProblemsPerDay(Math.ceil(DSA_SHEET_PROBLEMS / (form.duration * 30)));
  }, [form.duration]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };


  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserInfo());
      router.push("/home");
    }
  }, [isAuthenticated, dispatch]);

  const validateStepTwo = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email address";
  
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
  
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStepTwo()) return;
  
    const { username, email, password, name, language } = form;
    const userData = {
      email,
      name,
      username,
      password,
      language,
      dailyTarget: problemsPerDay,
    };
  
    console.log("Submitting signup with data:", userData);
  
    try {
      const result = await dispatch(signupUser(userData));
  
      if (signupUser.fulfilled.match(result)) {
        console.log("Signup successful, result:", result.payload);
        toast.success("Signup successful!");
        // Let the auth system handle the redirect naturally
      } else {
        console.log("Signup failed:", result.payload);
        toast.error(result.payload || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const { email, password } = form;
    
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      toast.success("Login successful!");
      await dispatch(getUserInfo());
      router.push("/home");
    } else {
      toast(result.payload || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-white dark:bg-zinc-900">
      <div className="shadow-input w-full max-w-md rounded-xl bg-white dark:bg-zinc-800 p-6 sm:p-8 border border-zinc-200 dark:border-zinc-700">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="login">Log In</TabsTrigger>
          </TabsList>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="mt-0">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
              Create an account
            </h2>
            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
              Let's get you started with Codexa
            </p>

            <form className="space-y-4" onSubmit={currentStep === 1 ? handleNext : handleSubmit}>
              {currentStep === 1 ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <LabelMod htmlFor="language">Language</LabelMod>
                    <Select value={form.language} onValueChange={(v) => handleChange("language", v)}>
                      <SelectTrigger className="w-full h-10 text-sm">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <LabelMod htmlFor="dsaSheet">DSA Sheet</LabelMod>
                    <Select value={form.dsaSheet} onValueChange={(v) => handleChange("dsaSheet", v)}>
                      <SelectTrigger className="w-full h-10 text-sm">
                        <SelectValue placeholder="Select DSA Sheet" />
                      </SelectTrigger>
                      <SelectContent>
                        {dsaSheets.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <LabelMod htmlFor="duration">How many months to complete DSA?</LabelMod>
                    <Select value={form.duration.toString()} onValueChange={(v) => handleChange("duration", Number(v))}>
                      <SelectTrigger className="w-full h-10 text-sm">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map((m) => (
                          <SelectItem key={m} value={m.toString()}>{m} months</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="font-semibold">Problems per day: </span>
                    {problemsPerDay}
                  </div>

                  <button
                    type="submit"
                    className="group/btn mt-4 relative h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-700 font-medium text-white dark:from-zinc-800 dark:to-zinc-700"
                  >
                    Next &rarr;
                    <BottomGradient />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                   <div>
                    <LabelMod htmlFor="name">Name</LabelMod>
                    <InputMod
                      id="name" 
                      type="text"
                      className="h-10 text-sm"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="name"
                      autoComplete="name"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                  </div>
                  <div>
                    <LabelMod htmlFor="username">Username</LabelMod>
                    <InputMod
                      id="username"
                      type="text"
                      className="h-10 text-sm"
                      value={form.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      placeholder="Username"
                      autoComplete="username"
                    />
                    {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
                  </div>

                  <div>
                    <LabelMod htmlFor="email">Email</LabelMod>
                    <InputMod
                      id="email"
                      type="email"
                      className="h-10 text-sm"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div>
                    <LabelMod htmlFor="password">Password</LabelMod>
                    <InputMod
                      id="password"
                      type="password"
                      className="h-10 text-sm"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                  </div>

                  <div>
                    <LabelMod htmlFor="confirmPassword">Confirm Password</LabelMod>
                    <InputMod
                      id="confirmPassword"
                      type="password"
                      className="h-10 text-sm"
                      value={form.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/2 py-2 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2 rounded-md bg-black text-white text-sm font-semibold hover:bg-zinc-900"
                      onClick={handleSubmit}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}
            </form>
          </TabsContent>

          {/* Login Tab */}
          <TabsContent value="login" className="mt-0">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
              Welcome back
            </h2>
            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
              Log in to your Codexa account
            </p>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <LabelMod htmlFor="login-email">Email</LabelMod>
                <InputMod
                  id="login-email"
                  type="email"
                  className="h-10 text-sm"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <InputMod
                  id="login-password"
                  type="password"
                  className="h-10 text-sm mt-1"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-md bg-black text-white text-sm font-semibold hover:bg-zinc-900 h-10"
                onClick={handleLogin}
              >
                Log In
              </button>

              <p className="text-center text-sm text-zinc-700 dark:text-zinc-300">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign up
                </button>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

export default SignUp;
