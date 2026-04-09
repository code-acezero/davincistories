import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { Send, MapPin, Phone, Mail, Clock, Globe } from "lucide-react";

const OG_IMAGE = "https://davincistories.lovable.app/images/og-cover.jpg";

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
    <PageTransition>
      <Helmet>
        <title>Contact Us — DaVinci Stories</title>
        <meta name="description" content="Get in touch with DaVinci Stories. Contact us for photography and videography inquiries, collaborations, or project discussions." />
        <link rel="canonical" href="https://davincistories.lovable.app/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Us — DaVinci Stories" />
        <meta property="og:description" content="Get in touch with DaVinci Stories for photography and videography inquiries." />
        <meta property="og:url" content="https://davincistories.lovable.app/contact" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us — DaVinci Stories" />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        <section className="container px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-6xl text-center mb-4">
            Get in <span className="text-gradient-primary">Touch</span>
          </motion.h1>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
            Have a project in mind? Let's bring your vision to life.
          </p>

          <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
            {/* Contact info cards */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-4">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                  <div><h3 className="font-medium text-sm mb-1">Address</h3><p className="text-foreground/60 text-sm">Khoksa, Kushtia, Khulna, Bangladesh</p></div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-primary" /></div>
                  <div><h3 className="font-medium text-sm mb-1">Phone</h3><a href="tel:+8801603327099" className="text-foreground/60 text-sm hover:text-primary transition-colors">+8801603327099</a></div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
                  <div><h3 className="font-medium text-sm mb-1">Email</h3><a href="mailto:davincistories@gmail.com" className="text-foreground/60 text-sm hover:text-primary transition-colors">davincistories@gmail.com</a></div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-primary" /></div>
                  <div><h3 className="font-medium text-sm mb-1">Hours</h3><p className="text-foreground/60 text-sm">Sat-Thu: 10AM - 8PM</p></div>
                </div>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="lg:col-span-3 glass-card rounded-2xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-foreground/70 mb-1.5 block">Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all" required placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 mb-1.5 block">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all" required placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="text-sm text-foreground/70 mb-1.5 block">Subject</label>
                <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all" placeholder="What's this about?" />
              </div>
              <div>
                <label className="text-sm text-foreground/70 mb-1.5 block">Message *</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all resize-none" required placeholder="Tell us about your project..." />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-medium flex items-center justify-center gap-2 btn-glow disabled:opacity-50 transition-all text-sm">
                <Send size={16} /> {submitting ? "Sending..." : "Send Message"}
              </button>
            </motion.form>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Contact;
