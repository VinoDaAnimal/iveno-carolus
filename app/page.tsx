import { CrowdSection } from "@/components/crowd/crowd-section";
import { EarlierResults } from "@/components/earlier-results";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Contact, Skills } from "@/components/skills-contact";
import { VaultSection } from "@/components/vault/vault-section";
import { Work } from "@/components/work";
import { contact, person } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.currentRole,
  description: person.role,
  url: siteUrl,
  image: `${siteUrl}og.png`,
  worksFor: { "@type": "Organization", name: person.currentOrg },
  sameAs: [contact.linkedin, contact.github],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD guide: escape "<" so the payload can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <main id="main">
        <Hero />
        <CrowdSection />
        <EarlierResults />
        <VaultSection />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
