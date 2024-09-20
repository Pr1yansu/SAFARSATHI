import React, { useEffect } from "react";
import useModal from "../hooks/modal";
import { AnimatePresence, motion } from "framer-motion";
import Label from "../ui/label";
import Input from "../ui/input";
import { IoCloseOutline } from "react-icons/io5";
import Separator from "../ui/separator";
import Button from "../ui/button";
import { useLoginMutation, useRegisterMutation } from "../../store/apis/user";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const { isOpen, variant, close, open } = useModal();
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState({ email: "", password: "", name: "" });
  const onSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      setLoading(true);
      if (variant === "login") {
        const { data, error } = await login({
          email: user.email,
          password: user.password,
        });
        if (error) {
          toast.error(error);
          return;
        }
        if (data) {
          toast.success(data);
        }
      }
      if (variant === "register") {
        const { data, error } = await register({
          email: user.email,
          password: user.password,
          name: user.name,
        });
        if (error) {
          toast.error(error);
          return;
        }
        if (data) {
          toast.success(data);
          open("login");
        }
      }
    } catch (error) {
      toast.error(
        variant === "login" ? "Failed to login" : "Failed to register"
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        toast.dismiss();
      }, 1500);
    }
  };

  useEffect(() => {
    setUser({ email: "", password: "", name: "" });
  }, [variant, isOpen]);

  const handleGoogle = () => {
    window.open(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/auth/google`,
      "_self"
    );
  };

  const handleGithub = () => {
    window.open(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/auth/github`,
      "_self"
    );
  };

  if (variant !== "login" && variant !== "register") return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <motion.div
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg m-4 relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={variant}
                initial={{ opacity: 0, x: variant === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: variant === "login" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {variant === "login" && (
                  <LoginComponent
                    onSubmit={onSubmit}
                    loading={loading}
                    setUser={setUser}
                    user={user}
                    open={open}
                  />
                )}
                {variant === "register" && (
                  <RegisterComponent
                    onSubmit={onSubmit}
                    loading={loading}
                    setUser={setUser}
                    user={user}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <Separator className={"my-4"} />
            <div className="space-y-2">
              <Button
                size="md"
                intent="google"
                disabled={loading}
                className={"!w-full rounded-md"}
                onClick={handleGoogle}
              >
                Continue with Google
              </Button>
              <Button
                size="md"
                intent="github"
                disabled={loading}
                className={"!w-full rounded-md"}
                onClick={handleGithub}
              >
                Continue with Github
              </Button>
            </div>
            <Button
              size="icon"
              intent="ghost"
              disabled={loading}
              className={"absolute top-2 left-2"}
              onClick={close}
            >
              <IoCloseOutline size={24} />
            </Button>
            <div className="py-4">
              {variant === "login" ? (
                <p className="text-sm text-gray-500 text-center">
                  Don't have an account?{" "}
                  <span
                    className="text-purple-500 cursor-pointer"
                    onClick={() => {
                      if (loading) return;
                      open("register");
                    }}
                  >
                    Sign up
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Already have an account?{" "}
                  <span
                    className="text-purple-500 cursor-pointer"
                    onClick={() => {
                      if (loading) return;
                      open("login");
                    }}
                  >
                    Login
                  </span>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoginComponent = ({ onSubmit, loading, setUser, user, open }) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <div>
      <h4 className="text-lg font-semibold text-gray-800 text-center">Login</h4>
    </div>
    <Separator />
    <div className="space-y-2">
      <h4 className="text-2xl font-semibold text-gray-800">Welcome back!</h4>
      <p className="text-sm text-gray-500">Login to continue</p>
    </div>
    <div className="space-y-2">
      <Label htmlFor="email" hidden={true}>
        Email
      </Label>
      <Input
        type="email"
        id="email"
        placeholder="Email"
        className={"!p-6"}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="password" hidden={true}>
        Password
      </Label>
      <Input
        type="password"
        id="password"
        placeholder="Password"
        className={"!p-6"}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        value={user.password}
      />
    </div>
    <p
      className="text-sm text-gray-500 text-right cursor-pointer hover:underline"
      onClick={() => open("forgotPassword")}
    >
      Forgot password?
    </p>
    <Button
      size="md"
      intent="primary"
      className={"!w-full rounded-md"}
      disabled={loading}
    >
      Continue
    </Button>
  </form>
);

const RegisterComponent = ({ onSubmit, loading, setUser, user }) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <div>
      <h4 className="text-lg font-semibold text-gray-800 text-center">
        Register
      </h4>
    </div>
    <Separator />
    <div className="space-y-2">
      <h4 className="text-2xl font-semibold text-gray-800">Join us!</h4>
      <p className="text-sm text-gray-500">Register to continue</p>
    </div>
    <div className="space-y-2">
      <Label htmlFor="email" hidden={true}>
        Email
      </Label>
      <Input
        type="email"
        id="email"
        placeholder="Email"
        className={"!p-6"}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        value={user.email}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="name" hidden={true}>
        Name
      </Label>
      <Input
        type="text"
        id="name"
        placeholder="Name"
        className={"!p-6"}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        value={user.name}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="password" hidden={true}>
        Password
      </Label>
      <Input
        type="password"
        id="password"
        placeholder="Password"
        className={"!p-6"}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        value={user.password}
      />
    </div>
    <Button
      size="md"
      intent="primary"
      className={"!w-full rounded-md"}
      disabled={loading}
    >
      Continue
    </Button>
  </form>
);

export default Auth;
