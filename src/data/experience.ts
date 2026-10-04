import { Experience } from '../types';

export const experienceData: Experience[] = [
  {
    id: "exp-1",
    company: "ApexPlanet Software Pvt. Ltd.",
    role: "Data Analytics Intern",
    duration: "Aug-2026 — Present",
    location: "Remote",
    profile: "data-analyst",
    description: "Completed an end-to-end data analytics internship covering data preparation, exploratory analysis, SQL-based business analysis, dashboard development, statistical validation, and portfolio finalization.",
    responsibilities: [
      "Performed data profiling and quality assessment on a 1,000+ record sales dataset, identifying data quality issues and preparing the data for analysis.",
      "Cleaned and transformed sales data using Python/Pandas and Excel, including data validation, formatting, and preparation of an analysis-ready dataset.",
      "Conducted exploratory data analysis (EDA) using descriptive statistics and visualizations to identify sales trends, customer patterns, and product/category performance.",
      "Executed SQL queries to answer business questions using filtering, aggregation, and multi-table JOIN operations.",
      "Developed KPI-focused analysis and an interactive dashboard to communicate important business metrics, trends, and insights.",
      "Performed deeper analysis and applied statistical validation concepts to support data-driven conclusions and recommendations."
    ],
    achievements: [
      "Successfully completed and submitted all 5 internship tasks, covering the complete analytics workflow from data wrangling and EDA to dashboarding, statistical validation, and portfolio integration.",
      "Analyzed a 1,000-row sales dataset with 12 analytical attributes, covering customer, order, product, category, location, quantity, pricing, and sales information.",
    ],
    technologies: ["Python", "NumPy & Pandas", "SQL", "Power BI", "DAX" ,"Power Query", "Data Modeling", "Excel", "Data Visualization"],
  },
  {
    id: "exp-2",
    company: "Edunet Foundation",
    role: "Data Analytics Intern",
    duration: "Aug 2026 — Sept 2026",
    location: "Remote",
    profile: "data-analyst",
    description: "Completed a project-based Data Analytics internship through the VOIS for Tech Program, applying Python, Power BI, Power Query, DAX, and data visualization techniques to analyze real-world HR, agriculture, business, operations, and Airbnb datasets.",
    responsibilities: [
      "Analyzed 73K+ agriculture records covering 33 states, 646 districts, 122 crops, 6 seasons, and 19 years (2005–2023) using Power BI, Power Query, and DAX to identify regional and production trends.",
      "Built KPI-driven Power BI dashboards to present agriculture production patterns, regional performance, crop trends, and other key analytical insights.",
      "Cleaned and validated NYC Airbnb listings data using Python, Pandas, and NumPy, removing 2.53% duplicate records, correcting data types, standardizing categories, and treating outliers.",
      "Conducted exploratory and correlation analysis across 5 key variables — pricing, service fees, reviews, host listings, and availability — using Matplotlib and Seaborn to identify pricing and host-performance trends.",
      "Performed hands-on analysis of HR, Agriculture, and Business & Operations datasets, preparing analytical reports and project deliverables with LLM-assisted analysis where applicable.",
    ],
    achievements: [
      "Analyzed and visualized 73K+ agriculture records across 33 states, 646 districts, 122 crops, 6 seasons, and 19 years to uncover regional and production trends through KPI-driven Power BI dashboards.",
      "Cleaned and analyzed NYC Airbnb listing data, removing 2.53% duplicate records and performing data-type correction, category standardization, outlier treatment, exploratory analysis, and correlation analysis across 5 key variables.",
    ],
    technologies: ["Power BI", "Power Query", "DAX", "Python", "NumPy & Pandas","Data Visualization", "Data Cleaning", "EDA" ],
  },
];
