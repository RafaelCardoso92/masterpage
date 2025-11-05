const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rafael Cardoso",
    url: "https://rafaelcardoso.dev",
    image: "https://rafaelcardoso.dev/og-image.png",
    sameAs: [
      "https://www.linkedin.com/in/rafaelcardosouk/",
      "https://github.com/rafaelcardoso",
    ],
    jobTitle: "Full-Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    description: "Award-winning full-stack developer crafting exceptional digital experiences. Specializing in React, Next.js, TypeScript, and modern web technologies.",
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Web Development",
      "UI/UX Design",
      "WordPress",
      "Drupal",
      "SEO",
      "Performance Optimization",
    ],
    alumniOf: {
      "@type": "Organization",
      name: "Web Development",
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rafael Cardoso Portfolio",
    url: "https://rafaelcardoso.dev",
    description: "Portfolio showcasing full-stack web development projects and expertise in React, Next.js, and TypeScript.",
    author: {
      "@type": "Person",
      name: "Rafael Cardoso",
    },
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Rafael Cardoso - Web Development Services",
    image: "https://rafaelcardoso.dev/og-image.png",
    description: "Professional web development services specializing in React, Next.js, TypeScript, and modern web technologies.",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UK",
    },
    areaServed: "Worldwide",
    availableLanguage: ["English"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
      />
    </>
  );
};

export default StructuredData;
