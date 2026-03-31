import { useLocation } from "react-router-dom";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import InputField from "../components/form/InputField";
import TextAreaField from "../components/form/TextAreaField";

export default function Contact() {
  const location = useLocation();
  const { t } = useTranslation();
  const { subject = "", message = "", image = null } = location.state || {};

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject,
    message,
    image,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = async () => {
    try {
      setLoading(true);

      const result = await emailjs.send(
        "gmail_service_malena",
        "template_contact_malena",
        form, // includes image field now
        "YtA5lxqH9IEUE4zt5"
      );

      console.log("Email successfully sent:", result.text);
      alert(t("contact.success"));
      setForm({ name: "", email: "", subject: "", message: "", image: null });
    } catch (error) {
      console.error("Email send failed:", error);
      alert(t("contact.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmail();
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8 bg-white text-gray-800">
      <h1 className="text-3xl font-semibold mb-8 uppercase tracking-wide">
        {t("contact.title")}
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <InputField
          label={t("contact.name")}
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <InputField
          label={t("contact.email")}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          label={t("contact.subject")}
          name="subject"
          value={form.subject}
          onChange={handleChange}
        />
        <TextAreaField
          label={t("contact.message")}
          name="message"
          value={form.message}
          onChange={handleChange}
        />

        <div className="">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-black text-white uppercase tracking-wider ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-800 transition"
            }`}
          >
            {loading ? t("contact.sending") : t("contact.send")}
          </button>
        </div>

        {/* 👇 Show attached image if present */}
        {form.image && (
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-600 mb-1">{t("contact.attachedArtwork")}</p>
            <img
              src={form.image}
              alt="Attached artwork"
              className="max-w-full rounded shadow"
            />
          </div>
        )}

        
      </form>
    </div>
  );
}
