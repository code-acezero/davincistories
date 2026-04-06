import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { Send, MapPin, Phone, Mail } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email"),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast({ title: "Validation error", description: Object.values(result.error.flatten().fieldErrors).flat().join(", "), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(result.data as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <section className="container px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-5xl text-center mb-4">
            Get in Touch
          </motion.h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Have a project in mind? Let's bring your vision to life.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="font-recoleta text-xl mb-6">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <p className="text-foreground/75">Khoksa, Kushtia, Khulna, Bangladesh</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href="tel:+8801603327099" className="text-foreground/75 hover:text-primary transition-colors">+8801603327099</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href="mailto:davincistories@gmail.com" className="text-foreground/75 hover:text-primary transition-colors">davincistories@gmail.com</a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
              <div>
                <label className="text-sm text-foreground/70 mb-1 block">Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all" required />
              </div>
              <div>
                <label className="text-sm text-foreground/70 mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all" required />
              </div>
              <div>
                <label className="text-sm text-foreground/70 mb-1 block">Subject</label>
                <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm text-foreground/70 mb-1 block">Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none" required />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium flex items-center justify-center gap-2 btn-glow disabled:opacity-50 transition-all">
                <Send size={16} /> {submitting ? "Sending..." : "Send Message"}
              </button>
            </motion.form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
