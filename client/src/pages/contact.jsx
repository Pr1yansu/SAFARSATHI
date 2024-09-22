import React, { useState } from "react";
import Input from "../components/ui/input";
import Textarea from "../components/ui/text-area";
import Button from "../components/ui/button";
import { useSendMessageMutation } from "../store/apis/contact";
import toast from "react-hot-toast";
import { LuLoader2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const ContactForm = () => {
  const navigate = useNavigate();
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      })
        .unwrap()
        .then(() => {
          toast.success("Message sent successfully");
          setFormData({
            name: "",
            email: "",
            message: "",
          });
          navigate("/");
        })
        .catch((e) => {
          toast.error(e.message || "Failed to send message");
        });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-6 relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">Message</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LuLoader2 size={24} className="mr-2 animate-spin" /> Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
