"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { X } from "lucide-react";

const raleway = Raleway({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
});

// ─── Privacy Policy Content ────────────────────────────────────────────────
const privacyPolicyContent = [
  {
    title: "1. Information We Collect",
    items: [
      "Personal Information: When you sign up, we collect your name, email address, and profile photo via Google OAuth.",
      "Content Data: Any blog posts, comments, or other content you create on BlogVerse.",
      "Usage Data: Information about how you interact with the platform, including pages visited, time spent, search queries, and device/browser information.",
      "Cookies & Local Storage: We use cookies and similar technologies for session management, theme preferences, and analytics.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    items: [
      "To provide, maintain, and improve the BlogVerse platform.",
      "To personalise your experience, including content recommendations.",
      "To communicate with you about updates, new features, or support.",
      "To ensure security and prevent fraud or abuse.",
      "To comply with legal obligations under Indian law, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (DPDPA).",
    ],
  },
  {
    title: "3. Data Sharing & Disclosure",
    items: [
      "We do not sell your personal data to third parties.",
      "We may share data with trusted service providers (e.g., cloud hosting, analytics) who assist in operating the platform, subject to confidentiality agreements.",
      "We may disclose information if required by law, regulation, or legal process under Indian jurisdiction.",
      "Aggregated, anonymised data may be used for research and analytics purposes.",
    ],
  },
  {
    title: "4. Data Storage & Security",
    items: [
      "Your data is stored on secure servers with encryption at rest and in transit.",
      "We implement industry-standard security measures including HTTPS, secure authentication, and access controls.",
      "While we strive to protect your data, no method of transmission over the Internet is 100% secure.",
    ],
  },
  {
    title: "5. Your Rights",
    items: [
      "Access: You can request a copy of the personal data we hold about you.",
      "Correction: You may update or correct your personal information through your profile settings.",
      "Deletion: You may request deletion of your account and associated data by contacting us.",
      "Withdraw Consent: You may withdraw consent for data processing at any time, subject to legal obligations.",
      "Data Portability: You may request your data in a portable format as per applicable laws.",
    ],
  },
  {
    title: "6. Children's Privacy",
    items: [
      "BlogVerse is not intended for users under 18 years of age. We do not knowingly collect data from minors.",
      "If we become aware that a minor has provided personal data, we will take steps to delete such information.",
    ],
  },
  {
    title: "7. Third-Party Links",
    items: [
      "Blog posts may contain links to external websites. BlogVerse is not responsible for the privacy practices of third-party sites.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    items: [
      "We may update this Privacy Policy from time to time and will notify users of material changes via email or an in-app notification.",
      "Continued use of the platform after changes constitutes acceptance of the updated policy.",
    ],
  },
];

// ─── Terms of Service Content ──────────────────────────────────────────────
const termsOfServiceContent = [
  {
    title: "1. Acceptance of Terms",
    items: [
      "By accessing or using BlogVerse, you agree to be bound by these Terms of Service and our Privacy Policy.",
      "If you do not agree to these terms, you must not use the platform.",
      "These terms are governed by the laws of India, including the Information Technology Act, 2000 and the Indian Contract Act, 1872.",
    ],
  },
  {
    title: "2. User Accounts",
    items: [
      "You must sign in using a valid Google account to use BlogVerse.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You must provide accurate and complete information during registration.",
      "You must be at least 18 years old to create an account.",
      "BlogVerse reserves the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    title: "3. User-Generated Content",
    items: [
      "You retain ownership of the content (blog posts, comments, images) you publish on BlogVerse.",
      "By publishing content, you grant BlogVerse a non-exclusive, worldwide, royalty-free licence to display, distribute, and promote your content on the platform.",
      "You are solely responsible for the content you publish and must ensure it does not violate any applicable laws.",
      "BlogVerse reserves the right to remove content that violates these terms or is reported as inappropriate.",
    ],
  },
  {
    title: "4. Prohibited Content & Conduct",
    items: [
      "Content that promotes hatred, violence, discrimination, or harassment based on religion, caste, gender, race, ethnicity, or any other ground.",
      "Defamatory, obscene, or pornographic material.",
      "Content that infringes on intellectual property rights, copyrights, or trademarks of others.",
      "Spam, phishing, malware, or any form of automated content generation intended to deceive.",
      "Impersonation of any person or entity, or misrepresentation of your affiliation.",
      "Content that violates the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.",
      "Any content that threatens the sovereignty, integrity, or security of India.",
    ],
  },
  {
    title: "5. Intellectual Property",
    items: [
      "The BlogVerse name, logo, design, and software are the intellectual property of BlogVerse.",
      "You may not copy, modify, distribute, or create derivative works of the platform without permission.",
      "If you believe your intellectual property rights have been infringed, contact us at support@blogverse.in.",
    ],
  },
  {
    title: "6. Community Guidelines",
    items: [
      "Be respectful and constructive in your interactions with other users.",
      "Do not harass, bully, or intimidate other members of the community.",
      "Engage in good-faith discussions and respect differing opinions.",
      "Report violations of these guidelines through the platform's reporting feature.",
    ],
  },
  {
    title: "7. Disclaimer of Warranties",
    items: [
      "BlogVerse is provided on an \"as is\" and \"as available\" basis without warranties of any kind.",
      "We do not guarantee uninterrupted or error-free service.",
      "We are not responsible for the accuracy or reliability of user-generated content.",
      "BlogVerse acts as an intermediary and is protected under Section 79 of the Information Technology Act, 2000, subject to compliance with applicable rules.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    items: [
      "To the maximum extent permitted by Indian law, BlogVerse shall not be liable for any indirect, incidental, special, or consequential damages.",
      "Our total liability shall not exceed the amount paid by you (if any) for using the platform in the 12 months preceding the claim.",
      "This limitation applies regardless of the theory of liability.",
    ],
  },
  {
    title: "9. Indemnification",
    items: [
      "You agree to indemnify and hold BlogVerse harmless from any claims, losses, or damages arising from your use of the platform or violation of these terms.",
      "This includes reasonable legal fees and costs incurred in defence of such claims.",
    ],
  },
  {
    title: "10. Termination",
    items: [
      "You may delete your account at any time through the platform or by contacting support.",
      "BlogVerse may suspend or terminate your account for violating these terms, with or without prior notice.",
      "Upon termination, your right to use the platform ceases, but provisions regarding content ownership, liability, and indemnification survive.",
    ],
  },
  {
    title: "11. Governing Law & Dispute Resolution",
    items: [
      "These terms are governed by and construed in accordance with the laws of India.",
      "Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.",
      "Before initiating legal proceedings, parties agree to attempt resolution through good-faith negotiation for a period of 30 days.",
    ],
  },
  {
    title: "12. Changes to Terms",
    items: [
      "BlogVerse reserves the right to modify these terms at any time.",
      "Users will be notified of material changes via email or in-app notification at least 15 days before the changes take effect.",
      "Continued use of the platform after changes constitutes acceptance of the revised terms.",
    ],
  },
];

// ─── Legal Modal Component ─────────────────────────────────────────────────
function LegalModal({
  isOpen,
  onClose,
  title,
  sections,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sections: { title: string; items: string[] }[];
}) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h2 className={`${raleway.className} text-xl font-bold text-foreground`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-base font-bold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sign-In Page ──────────────────────────────────────────────────────────
function SignInContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Subtle background gradient blobs — matches the rest of the app */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <h1 className={`${raleway.className} text-xl md:text-2xl font-bold tracking-tight text-foreground`}>
              BlogVerse
            </h1>
          </Link>
        </div>
      </header>

      {/* Sign-in card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 md:p-10 animate-fadeInUp">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className={`${raleway.className} text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-400`}>
                BlogVerse
              </span>
            </div>
            <h2 className={`${raleway.className} text-2xl font-bold text-foreground mb-2`}>Welcome</h2>
            <p className="text-muted-foreground text-sm">Sign in to continue to BlogVerse</p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-card hover:bg-muted border border-border text-foreground font-medium py-3 px-6 rounded-full transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-semibold">Continue with Google</span>
          </button>

          <p className="text-center text-xs text-muted-foreground mt-8 leading-relaxed">
            By continuing, you agree to BlogVerse&apos;s{" "}
            <button
              onClick={() => setShowTerms(true)}
              className="text-primary hover:underline font-medium"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-primary hover:underline font-medium"
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>

      {/* Modals */}
      <LegalModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
        sections={termsOfServiceContent}
      />
      <LegalModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
        sections={privacyPolicyContent}
      />
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
