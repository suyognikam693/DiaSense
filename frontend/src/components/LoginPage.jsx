import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";

import {
  Activity,
  Mail,
  Lock,
  User as UserIcon,
} from "lucide-react";

import { toast } from "sonner";

export function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      onLogin(data.user);
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!signupName || !signupEmail || !signupPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      onLogin(data.user);
      toast.success("Account Created!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <Activity className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold">
              DiaSense
            </h1>
          </div>

          <p className="text-gray-600">
            Login to continue your health journey.
          </p>
        </div>

        <Card className="p-6 shadow-xl">

          <Tabs defaultValue="login">

            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">
                Login
              </TabsTrigger>

              <TabsTrigger value="signup">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* LOGIN */}

            <TabsContent value="login">

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                <div>
                  <Label>Email</Label>

                  <div className="relative mt-2">

                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) =>
                        setLoginEmail(e.target.value)
                      }
                    />

                  </div>
                </div>

                <div>
                  <Label>Password</Label>

                  <div className="relative mt-2">

                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) =>
                        setLoginPassword(e.target.value)
                      }
                    />

                  </div>
                </div>

                <Button
                  className="w-full"
                  type="submit"
                >
                  Login
                </Button>

              </form>

            </TabsContent>

            {/* SIGNUP */}

            <TabsContent value="signup">

              <form
                onSubmit={handleSignup}
                className="space-y-5"
              >

                <div>
                  <Label>Full Name</Label>

                  <div className="relative mt-2">

                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                    <Input
                      className="pl-10"
                      placeholder="Your Name"
                      value={signupName}
                      onChange={(e) =>
                        setSignupName(e.target.value)
                      }
                    />

                  </div>
                </div>

                <div>
                  <Label>Email</Label>

                  <div className="relative mt-2">

                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                    <Input
                      type="email"
                      className="pl-10"
                      placeholder="Email"
                      value={signupEmail}
                      onChange={(e) =>
                        setSignupEmail(e.target.value)
                      }
                    />

                  </div>
                </div>

                <div>
                  <Label>Password</Label>

                  <div className="relative mt-2">

                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                    <Input
                      type="password"
                      className="pl-10"
                      placeholder="Password"
                      value={signupPassword}
                      onChange={(e) =>
                        setSignupPassword(e.target.value)
                      }
                    />

                  </div>
                </div>

                <Button
                  className="w-full"
                  type="submit"
                >
                  Create Account
                </Button>

              </form>

            </TabsContent>

          </Tabs>

        </Card>

      </div>

    </div>
  );
}