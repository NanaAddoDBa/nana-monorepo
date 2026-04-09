export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl: string;
  category: string;
  links: {
    github?: string;
    live?: string;
    demo?: string;
  };
  stats?: {
    tests?: string;
    coverage?: string;
    time?: string;
  };
  featured?: boolean;
}

export interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  projects: number[];
}

export const projectsData = {
  featured: [
    {
      id: 1,
      title: "Test Automation Framework",
      description: "A scalable test automation framework using Cypress and Selenium.",
      longDescription: "Integrated with CI/CD pipelines for automated testing, offering robust reporting and coverage analytics.",
      technologies: ["Cypress", "Selenium", "JavaScript", "Jenkins"],
      //imageUrl: "/images/projects/test-automation.jpg",
      imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2560&auto=format&fit=crop",
      category: "Testing",
      links: {
        github: "https://github.com/Nana-Addo-d/test-automation",
        live: "https://demo.testframework.com",
        demo: "https://youtube.com/watch?v=demo",
      },
      stats: {
        tests: "500+",
        coverage: "95%",
        time: "50% faster",
      },
      featured: true,
    },
    {
      id: 2,
      title: "Responsive Portfolio Website",
      description: "A personal portfolio built with Next.js and Tailwind CSS.",
      technologies: ["Next.js", "React", "Tailwind CSS"],
      //imageUrl: "/images/projects/portfolio.jpg",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
      category: "Web Development",
      links: {
        github: "https://github.com/Nana-Addo-d/portfolio",
        live: "https://portfolio.demo.com",
      },
      featured: true,
    },
    {
      id: 3,
      title: "E-Commerce Platform",
      description: "An e-commerce application with cart and payment integration.",
      technologies: ["React", "Node.js", "Stripe"],
      //imageUrl: "/images/projects/e-commerce.jpg",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
      category: "Web Development",
      links: {
        github: "https://github.com/Nana-Addo-d/ecommerce",
        live: "https://ecommerce.demo.com",
      },
      featured: true,
    },
    {
      id: 4,
      title: "Mobile Expense Tracker",
      description: "A mobile app to track expenses and generate financial reports.",
      technologies: ["React Native", "Redux", "Expo"],
      //imageUrl: "/images/projects/expense-tracker.jpg",
      imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2560&auto=format&fit=crop",
      category: "Mobile Development",
      links: {
        github: "https://github.com/Nana-Addo-d/expense-tracker",
      },
      featured: true,
    },
  ],
  categories: [
    {
      id: "testing",
      name: "Testing",
      description: "Test automation and QA projects.",
      projects: [1],
    },
    {
      id: "web",
      name: "Web Development",
      description: "Modern web applications and websites.",
      projects: [2, 3],
    },
    {
      id: "mobile",
      name: "Mobile Development",
      description: "Cross-platform mobile applications.",
      projects: [4],
    },
  ],
};
