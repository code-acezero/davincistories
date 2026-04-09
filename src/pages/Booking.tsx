import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { CalendarDays, CheckCircle } from "lucide-react";

const OG_IMAGE = "https://davincistories.lovable.app/images/og-cover.jpg";

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().max(20).optional(),
  service_id: z.string().uuid().optional().nullable(),
  preferred_date: z.string().optional(),
  message: z.string().trim().max(1000).optional(),
});

const Booking = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service_id: "", preferred_date: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: services } = useQuery({
    queryKey: ["services-list"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("id, title").eq("is_visible", true).order("display_order");
      return data ?? [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, service_id: form.service_id || null, preferred_date: form.preferred_date || null };
    const result = bookingSchema.safeParse(payload);
    if (!result.success) {
      toast({ title: "Validation error", description: Object.values(result.error.flatten().fieldErrors).flat().join(", "), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert(result.data as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to submit booking.", variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Book a Session — DaVinci Stories</title>
        <meta name="description" content="Book a professional photography or videography session with DaVinci Stories. Choose your service, pick a date, and let's create magic together." />
        <link rel="canonical" href="https://davincistories.lovable.app/booking" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Book a Session — DaVinci Stories" />
        <meta property="og:description" content="Book a professional photography or videography session." />
        <meta property="og:url" content="https://davincistories.lovable.app/booking" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book a Session — DaVinci Stories" />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        <section className="container max-w-2xl mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-recoleta text-4xl md:text-6xl text-center mb-4">
            Book a <span className="text-gradient-primary">Session</span>
          </motion.h1>
          <p className="text-center text-muted-foreground mb-12">
            Ready to create something magical? Book your session now.
          </p>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card-strong rounded-3xl p-12 text-center">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h2 className="font-recoleta text-2xl mb-2">Booking Submitted!</h2>
              <p className="text-muted-foreground mb-6">We'll contact you to confirm your session details.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", service_id: "", preferred_date: "", message: "" }); }} className="text-primary hover:underline text-sm">
                Book Another Session
              </button>
            </motion.div>
          ) : (
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
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
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-foreground/70 mb-1.5 block">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all" placeholder="+880..." />
                </div>
                <div>
                  <label className="text-sm text-foreground/70 mb-1.5 block">Preferred Date</label>
                  <input type="date" value={form.preferred_date} onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm text-foreground/70 mb-1.5 block">Service</label>
                <select value={form.service_id} onChange={e => setForm(f => ({ ...f, service_id: e.target.value }))} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all">
                  <option value="">Select a service</option>
                  {services?.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-foreground/70 mb-1.5 block">Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all resize-none" placeholder="Tell us about your vision..." />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-medium flex items-center justify-center gap-2 btn-glow disabled:opacity-50 text-sm">
                <CalendarDays size={16} /> {submitting ? "Submitting..." : "Book Now"}
              </button>
            </motion.form>
          )}
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Booking;
