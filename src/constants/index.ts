export interface ExploreWorld {
  id: string;
  imgUrl: string;
  title: string;
  text: string;
}

export interface NewFeature {
  imgUrl: string;
  title: string;
  subtitle: string;
}

export interface Insight {
  imgUrl: string;
  title: string;
  subtitle: string;
}

export interface Social {
  name: string;
  url: string;
  link: string;
}

export const exploreWorlds: ExploreWorld[] = [
  {
    id: "react",
    imgUrl: "/react.png",
    title: "React",
    text: "Powerful frameworks",
  },
  {
    id: "frontend",
    imgUrl: "/frontend.png",
    title: "Frontend development",
    text: "pixel perfect",
  },
  {
    id: "git",
    imgUrl: "/git.png",
    title: "Git",
    text: "Version control systems",
  },
  {
    id: "storybook",
    imgUrl: "/storybook.png",
    title: "Storybook",
    text: "Unit testing",
  },
  {
    id: "drupal",
    imgUrl: "/drupal.png",
    title: "Drupal",
    text: "CMS",
  },
];

export const startingFeatures: string[] = [
  "I can create pages using the most popular builders and plugins",
  "Crafting WordPress Websites with SEO Mastery: Elevating Online Visibility and Performance to New Heights.",
];

export const newFeatures: NewFeature[] = [
  {
    imgUrl: "/fast.svg",
    title: "The fastest pages",
    subtitle: "With Next JS I can create pages that are blazing fast",
  },
  {
    imgUrl: "/customize.svg",
    title: "Truly bespoke",
    subtitle: "I can make it as you envisioned, no compromises",
  },
];

export const insights: Insight[] = [
  {
    imgUrl: "/idea.svg",
    title: "Passion for Problem Solving",
    subtitle:
      "I thrive on the challenge of solving complex problems. I enjoy dissecting issues, finding efficient solutions, and improving upon existing processes.",
  },
  {
    imgUrl: "/school.svg",
    title: "Continuous Learning",
    subtitle:
      "A drive to thrive often stems from a thirst for knowledge. I am motivated by the opportunity to continuously learn and stay updated with the latest technologies, methodologies, and best practices in software development.",
  },
  {
    imgUrl: "/autonomy.svg",
    title: "Autonomy and Ownership",
    subtitle:
      "I value autonomy and take ownership of my work. I enjoy having the freedom to make decisions, take initiative, and see my projects through from start to finish.",
  },
];

export const socials: Social[] = [
  {
    name: "linkedin",
    url: "/linkedin.svg",
    link: "https://www.linkedin.com/in/rafaelcardosouk/",
  },
];
