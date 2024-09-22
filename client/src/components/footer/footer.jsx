import { CiFacebook, CiInstagram, CiYoutube } from "react-icons/ci";
import Input from "../ui/input";
import Button from "../ui/button";
import { FaXTwitter } from "react-icons/fa6";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSubscribeMutation } from "../../store/apis/news-letter";
import React from "react";
import toast from "react-hot-toast";

export default function Footer() {
  const [subscribe] = useSubscribeMutation();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    try {
      setLoading(true);
      await subscribe({ email })
        .unwrap()
        .then(() => {
          toast.success("Thank you for subscribing");
          setEmail("");
        })
        .catch((e) => {
          toast.error(e);
        });
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="bg-white text-gray-800 ">
      <div className="container mx-auto p-4 border-t">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-violet-500">
              Newsletter
            </h3>
            <p className="text-sm">
              Subscribe to our newsletter for exclusive deals and travel tips.
            </p>
            <form className="flex gap-2" onSubmit={onSubmit}>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 text-gray-800 placeholder-gray-400"
              />
              <Button
                type="submit"
                className="rounded-md"
                size="sm"
                disabled={loading}
              >
                Subscribe <BsArrowRight size={20} className="ml-2" />
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex space-x-4">
            {[
              {
                icon: <CiFacebook size={20} />,
                href: "https://www.facebook.com/",
              },
              {
                icon: <FaXTwitter size={20} />,
                href: "https://x.com",
              },
              {
                icon: <CiInstagram size={20} />,
                href: "https://www.instagram.com/",
              },
              {
                icon: <CiYoutube size={20} />,
                href: "https://www.youtube.com",
              },
            ].map(({ icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="text-gray-600 hover:text-violet-500 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                {icon}
              </a>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} SAFARSATHI. All rights reserved.
          </div>
          <Link
            to="/contact"
            className="text-sm font-semibold text-violet-500 capitalize hover:underline"
          >
            contact us
          </Link>
        </div>
      </div>
    </footer>
  );
}
