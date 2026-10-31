// Every value here is copied from content/*.md. Nothing is invented.

export type Medal = "gold" | "silver" | "bronze";

export type MedalResult = {
  id: string;
  name: string;
  question: string;
  url: string;
  tags: string[];
  medal: Medal;
  rank: number;
  field: number;
  /** As listed on Zindi; the competition's pool, not Iveno's winnings. */
  prize: string;
};

export const medals: MedalResult[] = [
  { id: "trust", name: "The African Trust & Safety LLM Challenge", question: "Can Africa’s AI withstand its own linguistic and cultural complexity?", url: "https://zindi.world/competitions/the-african-trust-safety-llm-challenge", tags: ["Prompt Engineering", "AI Trust and Safety", "Safety", "Trust"], medal: "gold", rank: 13, field: 288, prize: "$5 000 USD" },
  { id: "sendy", name: "EDSA 2020: Sendy Logistics Challenge", question: "Predict the estimated time of arrival (ETA) for motorbike deliveries in Nairobi", url: "https://zindi.world/competitions/edsa-sendy-logistics-challenge", tags: ["Prediction", "Logistics", "Supply Chain Optimization", "Fleet Management"], medal: "gold", rank: 4, field: 159, prize: "Knowledge competition" },
  { id: "nedbank", name: "Nedbank Transaction Volume Forecasting Challenge", question: "Can you turn behavioural signals into accurate transaction forecasts?", url: "https://zindi.world/competitions/nedbank-transaction-volume-forecasting-challenge", tags: ["Feature Engineering", "Time-series", "Forecast"], medal: "gold", rank: 25, field: 251, prize: "R250 000 ZAR" },
  { id: "trail", name: "Trailblazers Qualification Challenge", question: "Build a model and complete your Zindi profile to qualify as a Trailblazer", url: "https://zindi.world/competitions/be-a-trailblazer", tags: ["Prediction"], medal: "silver", rank: 42, field: 259, prize: "1 000 Zindi Points" },
  { id: "crypto", name: "Cryptocurrency Closing Price Prediction", question: "Can you predict the closing price for a cryptocurrency?", url: "https://zindi.world/competitions/cryptocurrency-closing-price-prediction", tags: ["Prediction", "Cryptocurrency", "Financial Services"], medal: "silver", rank: 64, field: 323, prize: "$1 000 USD" },
  { id: "vacc", name: "EDSA: To Vaccinate or Not to Vaccinate: It’s not a Question", question: "Analysing social media sentiment towards vaccines", url: "https://zindi.world/competitions/edsa-to-vaccinate-or-not-to-vaccinate-its-not-a-question", tags: ["Natural Language Processing", "Classification", "Sentiment Analysis"], medal: "bronze", rank: 51, field: 193, prize: "Knowledge competition" },
  { id: "geo", name: "GeoAI Aquaculture Pond Identification Challenge", question: "Can you identify aquaculture ponds from space?", url: "https://zindi.world/competitions/geoai-aquaculture-pond-identification-challenge", tags: ["Classification", "GIS", "Agriculture"], medal: "bronze", rank: 168, field: 604, prize: "1000 CHF" },
  { id: "olympics", name: "Olympic 2024 Medal Prediction Challenge", question: "Can you predict the medal count for each country in the Paris 2024 Olympics?", url: "https://zindi.world/competitions/olympic-2024-medal-prediction-challenge", tags: ["Forecast", "Sport"], medal: "bronze", rank: 10, field: 137, prize: "3 000 Zindi Points" },
];

/** Best finish first: the order the crowd is walked in. */
export const medalsByFinish = [...medals].sort((a, b) => a.rank / a.field - b.rank / b.field);

/** Old-site results with a published percentile but no rank or medal. */
export const unranked = [
  { id: "insurance", name: "Insurance Prediction Challenge", topPct: 10.64, field: 621, unit: "active participants", note: "Nov 2019 - Present" },
  { id: "beam", name: "Spatio-Temporal Beam-Level Traffic Forecasting Challenge", topPct: 18.7, field: 171, unit: "participants", note: "Jul 2024 - Oct 2024, prize pool 12 000 CHF" },
];

export type Role = {
  title: string;
  org: string;
  dates: string;
  from: number;
  /** Last calendar year of the role; null = present. */
  to: number | null;
  track: "employed" | "freelance";
  description: string;
  /** Plot overrides in fractional years, where Iveno gave more than the year. */
  start?: number;
  end?: number;
};

// Iveno: left Spirit Invest early 2026 (around Feb) and started at SeedGrowth straight after.
const HANDOVER_2026 = 2026 + 1.5 / 12;

export const roles: Role[] = [
  { title: "Analytics Engineer", org: "SeedGrowth Analytics", dates: "2026 - Present", from: 2026, to: null, start: HANDOVER_2026, track: "employed", description: "Design and maintain scalable data pipelines and ETL workflows using cloud platforms such as Azure. Build and optimize data models for analytics and reporting, ensuring high data quality, integrity, and performance. Collaborate with cross-functional teams to translate business requirements into data solutions, leveraging tools like SQL, Python, and cloud-native services (e.g., data lakes, warehouses, and orchestration tools). Implement monitoring, automation, and CI/CD practices to support reliable and efficient data operations." },
  { title: "Freelance Data Scientist & Developer", org: "Self-Employed", dates: "2024 - Present", from: 2024, to: null, track: "freelance", description: "Developing full-stack web applications, implementing machine learning solutions, and providing data science consulting services for various clients." },
  { title: "Business Intelligence Manager (Junior)", org: "Spirit Invest", dates: "2024 - 2026", from: 2024, to: 2026, end: HANDOVER_2026, track: "employed", description: "Leading business intelligence initiatives, developing advanced analytics solutions, and managing data-driven decision making processes for financial operations." },
  { title: "Data Science Associate (Contractor)", org: "Cavell Group", dates: "2022 - 2023", from: 2022, to: 2023, track: "employed", description: "Designed and implemented complex web scraping pipelines using Python and Azure services. Integrated cutting-edge LLMs for data summarization and insight extraction. Optimized performance with Azure Data Factory and custom ETL packages." },
  { title: "Junior Data Scientist & Analyst", org: "Sprout Performance Partners", dates: "2021 - 2022", from: 2021, to: 2022, track: "employed", description: "Automated data processes and analyzed digital marketing data using GCP. Significantly improved campaign strategies and operational efficiency through advanced analytics and reporting automation." },
  { title: "Junior Data Scientist", org: "Ignition Group", dates: "2021", from: 2021, to: 2021, track: "employed", description: "Expanded expertise in big data visualization and cloud-based data solutions. Contributed to enterprise-level data analytics projects and reporting systems." },
  { title: "Data Science Intern", org: "Ignition Group", dates: "2020", from: 2020, to: 2020, track: "employed", description: "Gained critical skills in data analytics and machine learning. Contributed to data visualization projects and learned industry best practices." },
];

/** Zindi entries with a month on the old site (fractional years). */
export const datedEntries = [
  { label: "Insurance Prediction Challenge, Nov 2019", at: 2019 + 10 / 12 },
  { label: "Cryptocurrency Closing Price Prediction, Jun 2021, silver", at: 2021 + 5 / 12, medal: "silver" as Medal },
  { label: "Trailblazers Qualification Challenge, Feb 2022, silver", at: 2022 + 1 / 12, medal: "silver" as Medal },
  { label: "Spatio-Temporal Beam-Level Traffic Forecasting Challenge, Jul 2024", at: 2024 + 6 / 12 },
  { label: "Olympic 2024 Medal Prediction Challenge, Aug 2024, bronze", at: 2024 + 7 / 12, medal: "bronze" as Medal },
];

/** "Present" on the career axis. Bumped by hand; the chart never runs past it. */
export const NOW = 2026 + 10 / 12;

/** Plotted span: whole calendar years ("2021 - 2022" covers both), unless overridden, capped at today. */
export function roleSpan(r: Role): [number, number] {
  return [r.start ?? r.from, Math.min(r.end ?? (r.to === null ? NOW : r.to + 1), NOW)];
}

export const projects = [
  { id: "malinga", name: "Malinga All Nations Web App", description: "A multi-device web application combining an online store, on-premise POS system, and admin management platform. The system enables customers to order products remotely and enroll in retail training courses, while supporting in-store sales, inventory, and staff management through a secure local network deployment.", stack: ["React.js", "Node.js", "MySQL", "POS Systems", "On-Prem Infrastructure", "Full-Stack Development"], dates: "Oct 2025 - Mar 2026", status: "Production (In-Store Deployment)" },
  { id: "cavell", name: "Advanced Data Pipeline & Web Scraping System", org: "Cavell Group", description: "State-of-the-art data pipeline performing advanced web scraping across 1.4 million URLs. Collects, cleans, and structures text data while mining collective information for dashboarding and AI training preparation.", stack: ["Web Scraping", "Data Pipeline", "ETL Processing", "Azure", "Python", "Data Mining", "LLMs"], dates: "2022 - 2023", status: "Enterprise Data Pipeline", figure: { value: 1_400_000, label: "URLs scraped" } },
  { id: "africa-bites", name: "Africa-Bites", description: "Comprehensive African cuisine website with recipes, history, and YouTube video integration using web scraping and vanilla technologies.", stack: ["Web Scraping", "HTML/CSS", "JavaScript", "Bootstrap", "Python"], dates: "Apr 2020 - May 2020", status: "Hackathon Project" },
  { id: "wethinkcode", name: "WeThinkCode C Projects", description: "Complete first semester programming projects at WeThinkCode, demonstrating fundamental programming skills and problem-solving abilities.", stack: ["C Programming", "Algorithms", "Data Structures", "Problem Solving"], dates: "May 2019 - Dec 2019", status: "Educational Projects" },
];

export const skills = [
  { group: "Python Ecosystem", items: ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Django", "FastAPI", "Scrapy"] },
  { group: "Data Science & Analytics", items: ["Machine Learning", "Deep Learning", "Time Series", "Statistical Analysis", "Data Visualization", "Feature Engineering"] },
  { group: "Analytics & BI", items: ["Microsoft Fabric", "Power BI", "DAX"] },
  { group: "Cloud & Infrastructure", items: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "CI/CD"] },
  { group: "Databases & Big Data", items: ["SQL", "MongoDB", "PostgreSQL", "BigQuery", "Apache Spark", "ETL"] },
  { group: "Development & Tools", items: ["JavaScript", "React", "Node.js", "Git", "Linux", "Jupyter"] },
];

export const about = [
  "Iveno Carolus is a seasoned Data Professional and Python Developer with over 10 years of experience in Python development. His expertise spans machine learning, deep learning, data engineering, data analysis, and full-stack development. Starting coding at age 12 with a passion for intelligent software, Iveno has built a comprehensive skill set across the entire data science and ML pipeline.",
  "His professional journey showcases deep expertise in Python-based ML frameworks (TensorFlow, PyTorch, Scikit-learn) and data engineering tools. At Cavell Group, he developed complex web scraping pipelines and integrated LLMs for advanced data processing. His work at Sprout Performance Partners involved sophisticated data analysis and automation using GCP. He is now an Analytics Engineer at SeedGrowth Analytics, after leading data-driven initiatives in finance as Business Intelligence Manager at Spirit Invest.",
  "As a freelance developer, Iveno has successfully delivered full-stack applications combining ML capabilities with modern web technologies. His competitive programming achievements in ML competitions (Zindi, Kaggle) validate his technical prowess and problem-solving abilities in real-world machine learning challenges.",
];

// From Iveno's brief (2026-10-31): "the current role is mostly Microsoft Fabric, Power BI and Azure".
export const currentRoleTools = ["Microsoft Fabric", "Power BI", "Azure"];

export const contact = {
  email: "ivenocarolus@gmail.com",
  linkedin: "https://www.linkedin.com/in/iveno-carolus-413375159/",
  github: "https://github.com/VinoDaAnimal",
};

export const person = {
  name: "Iveno Carolus",
  role: "Data Professional & Python Developer",
  lede: "Specializing in deep learning, data engineering, data analysis, and full-stack development with 10+ years of Python experience.",
  currentRole: "Analytics Engineer",
  currentOrg: "SeedGrowth Analytics",
};
