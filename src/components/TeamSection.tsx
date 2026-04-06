import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TeamMember {
  name: string;
  role: string;
  title: string;
  image1: string;
  image2: string;
  description: string;
  contacts: { type: string; url: string; icon: string }[];
}

const teamMembers: TeamMember[] = [
  {
    name: "Azim Khan",
    role: "Lead Cinematographer",
    title: "Cinematographer, Photographer & Editor",
    image1: "/images/azim-1.jpg",
    image2: "/gallery/p8.jpg",
    description:
      "Azim is a seasoned cinematographer with more than 3 years of experience in capturing cinematic visuals. His passion for storytelling shines through in every frame.",
    contacts: [
      { type: "email", url: "mailto:azimkhan.zero@gmail.com", icon: "✉" },
      { type: "phone", url: "tel:+8801603327099", icon: "📞" },
      { type: "facebook", url: "https://www.facebook.com/azimkhan.acezero", icon: "f" },
      { type: "instagram", url: "https://www.instagram.com/azimkhan.acezero/", icon: "📷" },
    ],
  },
  {
    name: "Jahidul Islam",
    role: "Photographer & Editor",
    title: "Photographer & Editor",
    image1: "/images/jahid-1.jpg",
    image2: "/images/jahid-2.jpg",
    description:
      "Jahidul is a talented photographer known for his sharp eye for detail and creative compositions. He brings a unique perspective to every shoot.",
    contacts: [
      { type: "facebook", url: "#", icon: "f" },
    ],
  },
  {
    name: "Adib",
    role: "Photographer & Editor",
    title: "Photographer & Editor",
    image1: "/images/adib-1.jpg",
    image2: "/images/adib-2.jpg",
    description:
      "Adib specializes in portrait and event photography, delivering stunning visuals with every click.",
    contacts: [
      { type: "facebook", url: "#", icon: "f" },
    ],
  },
];

const TeamCard = ({ member, onShowPopup }: { member: TeamMember; onShowPopup: () => void }) => {
  const ref = useScrollReveal<HTMLLIElement>();

  return (
    <li ref={ref} className="space-y-6">
      {[member.image1, member.image2].map((img, i) => (
        <div key={i} className="relative group">
          <figure
            className="img-holder rounded-sm overflow-hidden relative"
            style={{ "--width": 450, "--height": 625 } as React.CSSProperties}
          >
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent z-[1]" />
            <img src={img} width={450} height={625} loading="lazy" alt={member.name} className="img-cover" />
          </figure>

          <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 z-[1]">
            <h3 className="font-recoleta text-xl md:text-2xl font-normal">
              <a href={member.contacts[0]?.url || "#"} className="hover:underline">
                {member.name}
              </a>
            </h3>
            <span className="text-foreground/70 text-base font-light">
              {i === 0 ? member.title : member.role}
            </span>
          </div>

          <button
            onClick={onShowPopup}
            className="absolute top-0 right-0 w-[50px] h-[50px] bg-foreground rounded-bl-[25px] grid place-content-center z-[1] transition-all hover:bg-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="20" viewBox="0 0 43 20" fill="none" className="-rotate-45">
              <path d="M0 10H41" stroke="hsl(0 0% 0%)" strokeWidth="2" />
              <path d="M33 1L41.9 10.2727L33 19" stroke="hsl(0 0% 0%)" strokeWidth="2" />
            </svg>
          </button>
        </div>
      ))}
    </li>
  );
};

const TeamSection = () => {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const titleRef = useScrollReveal<HTMLParagraphElement>();

  const activeMember = teamMembers.find((m) => m.name === activePopup);

  return (
    <section id="team" className="py-16 md:py-24">
      <div className="container">
        <p ref={titleRef} className="text-foreground/25 text-xl uppercase tracking-[3.5px] mb-10">
          Meet Our Team
        </p>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamCard key={member.name} member={member} onShowPopup={() => setActivePopup(member.name)} />
          ))}
        </ul>
      </div>

      {/* Popup */}
      {activeMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setActivePopup(null)} />
          <div className="relative bg-card/90 backdrop-blur-xl rounded-lg p-8 max-w-md w-full text-center z-10">
            <button
              onClick={() => setActivePopup(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary grid place-content-center"
            >
              <span className="text-primary-foreground text-lg leading-none">✕</span>
            </button>

            <h3 className="font-recoleta text-3xl mb-2">{activeMember.name}</h3>
            <p className="text-primary text-lg mb-4">{activeMember.role}</p>
            <p className="text-foreground/80 text-sm mb-6">{activeMember.description}</p>

            <p className="text-primary text-sm mb-3">Contact Info:</p>
            <div className="flex justify-center gap-4">
              {activeMember.contacts.map((c, i) => (
                <a
                  key={i}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-foreground/10 grid place-content-center text-foreground hover:text-primary transition-colors"
                >
                  {c.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeamSection;
