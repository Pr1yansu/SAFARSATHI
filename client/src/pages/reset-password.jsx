import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { BiArrowBack } from "react-icons/bi";
import { useResetPasswordMutation } from "../store/apis/user";

export default function ResetPassword() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [resetPassword] = useResetPasswordMutation();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(5); // Countdown timer
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await resetPassword({ token: id, password });
      if (error) {
        setMessage(error || "An error occurred");
        return;
      }
      setMessage(data);

      const countdownInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(countdownInterval);
            navigate("/");
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      setMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="mt-1">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className={"w-full rounded-md"}
                size="sm"
                intent="primary"
                disabled={loading} // Disable button when loading
              >
                {loading ? "Resetting..." : "Reset Password"}{" "}
                {/* Show loading text */}
              </Button>
            </div>
          </form>

          {message && (
            <div className="mt-4 text-center text-sm font-medium text-green-600">
              {message}
            </div>
          )}

          {message && timer > 0 && (
            <div className="mt-4 text-center text-sm font-medium text-red-600">
              Closing in {timer} seconds...
            </div>
          )}

          <div>
            <Link
              to="/"
              className="justify-center text-center mt-4 text-sm font-medium text-gray-600 hover:text-gray-500 flex items-center hover:underline"
            >
              <BiArrowBack className="mr-2" />
              Go back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
