import { UserProfile } from '../types';

export const userProfile: UserProfile = {
  name: "Ravi Kumar Shrivastav",
  primaryTitle: "Data Analyst",
  rotatingRoles: [
  "Data Analyst...",
  "Business Analyst",
  "Power BI Developer",
  "BI Analyst...",
  "Content Creator",
  ],
  secondaryTitle: "Power BI | SQL | Excel | DAX | Data Modeling | Business Intelligence",
  daHeadline: "Transforming raw and inconsistent datasets into clean, validated insights, interactive Power BI dashboards, and decision-ready reports using SQL, Power BI, Python, and Excel.",
  email: "ravishrivastav.da@gmail.com", // Replace with actual email, e.g., yourname@domain.com
  phone: "+91 6299566544", // Optional
  location: "Available for Remote & Hybrid Roles",
  linkedin: "https://linkedin.com/in/ravi003/",
  github: "https://github.com/Ravi10300",
  whatsapp: "https://wa.me/916299566544", // Replace with your WhatsApp link (e.g. https://wa.me/yourphonenumber)
  socialLinks: {
    facebook: "https://www.facebook.com/ravikumar.shrivastav.9615", // Replace with your Facebook profile/page URL
    youtube: "https://www.youtube.com/@W8try", // Replace with your YouTube channel URL
    twitter: "https://x.com/Ravikum10564472", // Replace with your Twitter / X profile URL
    instagram: "https://www.instagram.com/_ravi__003/", // Replace with your Instagram profile URL
    github: "https://github.com/Ravi10300", // Replace with your GitHub profile URL
    linkedin: "https://linkedin.com/in/ravi003/", // Replace with your LinkedIn profile URL
  },
  resumePath: `${import.meta.env.BASE_URL}Personal_Data/Data%20Analyst.pdf`,
  // =================================================================================
  // RESUME KNOWLEDGE SOURCE (Primary Source 2 for DataMate AI)
  // Paste your shareable Google Drive link below:
  // e.g. "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
  // =================================================================================
  resumeGoogleDriveUrl: "https://drive.google.com/file/d/1PnWGmVOjvnDPvTExZhLAYsNX6RSZpzND/view?usp=sharing", // Replace with your Google Drive resume link
  resumeSourceUrl: "https://drive.google.com/file/d/1PnWGmVOjvnDPvTExZhLAYsNX6RSZpzND/view?usp=sharing", // Backup / direct resume source URL
  photoPath: `${import.meta.env.BASE_URL}Personal_Data/image_e.jpg`,
  bioOverview:
    "I am a results-driven Data Analyst specializing in Business Intelligence, data modeling, and performance analytics. I transform raw, fragmented data into robust relational models, automated ETL workflows, and high-impact Power BI dashboards that empower stakeholders to make confident, data-backed strategic decisions.",
  daBio:
    "As a Data Analyst, I work across the data analytics lifecycle — from cleaning and validating raw datasets to transforming data with SQL and Power Query, building multi-table data models, creating DAX measures, and developing interactive Power BI dashboards. My focus is on turning complex datasets into clear KPIs, actionable insights, and decision-ready reports that help stakeholders understand data and make informed decisions.",
  whatIBring: [
    {
      title: "Analytical & Problem-Solving",
      description: "Structured data analysis, trend identification, data validation, correlation analysis, and identifying patterns within complex datasets.",
      iconName: "BrainCircuit",
    },
    {
      title: "Business & KPI Analysis",
      description: "Analyzing performance metrics, comparing results across segments, and translating data into clear KPIs and actionable insights.",
      iconName: "Briefcase",
    },
    {
      title: "Data Modeling & Transformation",
      description: "Building multi-table data models, establishing relationships between datasets, and transforming raw data using Power Query and SQL.",
      iconName: "Database",
    },
    {
      title: "Interactive Power BI Reporting",
      description: "Designing interactive Power BI dashboards with KPI cards, slicers, drill-through navigation, and segment-level analysis to make reporting easier for non-technical users.",
      iconName: "BarChart3",
    },
    {
      title: "SQL & Data Transformation",
      description: "Using SQL for data extraction, joins, filtering, aggregation, and analytical queries, combined with Power Query for data preparation and transformation.",
      iconName: "FileSpreadsheet",
    },
    {
      title: "Data Storytelling",
      description: "Turning complex analysis into clear visual reports and insights that make trends, comparisons, and key findings easier for non-technical users to understand.",
      iconName: "Users",
    },
  ],
  whatICanDo: [
    {
      id: "wcd-1",
      title: "Interactive Power BI Dashboards",
      description: "Build interactive Power BI dashboards with KPI cards, slicers, drill-through navigation, and clear visual reporting.",
      profile: "data-analyst",
      iconName: "LayoutDashboard",
    },
    {
      id: "wcd-2",
      title: "SQL & Data Analysis",
      description: "Use SQL and MySQL for data cleaning, joining datasets, filtering, aggregation, and preparing data for analysis and reporting.",
      profile: "data-analyst",
      iconName: "Database",
    },
    {
      id: "wcd-3",
      title: "Data Modeling & Relationships",
      description: "Build multi-table data models, establish relationships between datasets, and organize data for reliable analysis and reporting.",
      profile: "data-analyst",
      iconName: "Network",
    },
    {
      id: "wcd-4",
      title: "DAX Measures & KPIs",
      description: "Create DAX measures and KPI calculations to track business performance, compare metrics, and surface meaningful trends.",
      profile: "data-analyst",
      iconName: "Calculator",
    },
    {
      id: "wcd-5",
      title: "Excel Data Analysis & Pivot Tables",
      description: "Use Excel for data cleaning, validation, analysis, Pivot Tables, VLOOKUP, and preparing datasets for reporting.",
      profile: "data-analyst",
      iconName: "FileSpreadsheet",
    },
    {
      id: "wcd-6",
      title: "Power Query & Data Transformation",
      description: "Transform, clean, validate, and prepare raw datasets using Power Query for reliable analysis and Power BI reporting.",
      profile: "data-analyst",
      iconName: "GitBranch",
    },
    {
      id: "wcd-7",
      title: "Exploratory & Correlation Analysis",
      description: "Explore datasets, identify trends and patterns, and use correlation analysis to understand relationships between key variables.",
      profile: "data-analyst",
      iconName: "CheckSquare",
    },
    {
      id: "wcd-8",
      title: "Requirements-to-Dashboard Translation",
      description: "Translate data requirements into relevant KPIs, analytical views, and interactive dashboards that support clearer business decisions.",
      profile: "data-analyst",
      iconName: "Workflow",
    },
  ],
  analyticsWorkflow: [
    {
      stepNumber: "01",
      title: "Understand",
      shortSummary: "Business Problem & Analytical Objectives",
      description: "Understand the analytical requirement, identify key business questions and KPIs, and define the scope of the analysis or reporting requirement.",
      iconName: "HelpCircle",
      keyActivities: ["Requirement Analysis", "Problem Understanding", "KPI Identification", "Analysis Scope"],
      deliverable: "Analytical Requirements & KPI Scope",
    },
    {
      stepNumber: "02",
      title: "Prepare",
      shortSummary: "Data Collection, Cleaning & Transformation",
      description: "Clean, validate, transform, and prepare raw datasets using SQL, Power Query, and Python for reliable analysis and reporting.",
      iconName: "FileCog",
      keyActivities: ["Data Cleaning", "Data Validation", "Data Transformation", "Data Preparation"],
      deliverable: "Clean & Analysis-Ready Dataset",
    },
    {
      stepNumber: "03",
      title: "Model",
      shortSummary: "Data Modeling & Relationships",
      description: "Build multi-table data models, establish relationships between datasets, and organize data for reliable KPI analysis and Power BI reporting.",
      iconName: "Boxes",
      keyActivities: ["Multi-Table Modeling", "Relationship Setup", "Data Structure Analysis", "Model Validation"],
      deliverable: "Reliable Power BI Data Model",
    },
    {
      stepNumber: "04",
      title: "Analyze",
      shortSummary: "SQL Queries, DAX Measures & Analysis",
      description: "Use SQL for data analysis and DAX measures for KPI calculations, performance comparisons, trend analysis, and meaningful insights.",
      iconName: "Binary",
      keyActivities: ["DAX Measure Creation", "SQL Aggregation & Analysis", "Trend Analysis", "KPI Analysis"],
      deliverable: "Calculated KPIs & Analytical Findings",
    },
    {
      stepNumber: "05",
      title: "Visualize",
      shortSummary: "Interactive Power BI Dashboards",
      description: "Design clear and interactive Power BI reports using KPI cards, slicers, drill-through navigation, trend views, and segment-level analysis.",
      iconName: "BarChart4",
      keyActivities: ["Dashboard Layout", "KPI Cards & Slicers", "Drill-Through Navigation", "Trend & Segment Analysis"],
      deliverable: "Interactive Power BI Dashboard",
    },
    {
      stepNumber: "06",
      title: "Recommend",
      shortSummary: "Actionable Insights & Data-Driven Recommendations",
      description: "Translate validated analysis into clear findings, performance insights, and actionable observations that help stakeholders understand data and make informed decisions.",
      iconName: "TrendingUp",
      keyActivities: ["Insight Presentation", "KPI & Trend Interpretation", "Data Storytelling", "Actionable Observations"],
      deliverable: "Decision-Ready Insights & Recommendations",
    },
  ],
  fromRequirementToDashboard: [
    {
      stepNumber: 1,
      stage: "Requirement",
      phase: "Business",
      title: "Data & Reporting Requirements",
      description: "Identify the reporting objective, key metrics, required analysis, and the questions the final dashboard should answer.",
      deliverable: "A clear set of reporting objectives, KPIs, data requirements, and analytical questions to guide the dashboard development process.",
      tools: ["Requirement Analysis", "KPI Identification", "Business Questions"],
    },
    {
      stepNumber: 2,
      stage: "Objective",
      phase: "Business",
      title: "Define KPIs & Analytical Goals",
      description: "Translate the reporting objective into measurable KPIs, required dimensions, comparisons, and analytical views.",
      deliverable: "A structured list of metrics and analytical views required to evaluate performance and surface meaningful trends.",
      tools: ["KPI Definition", "Metric Mapping", "Analytical Planning"],
    },
    {
      stepNumber: 3,
      stage: "Data Mapping",
      phase: "Bridge",
      title: "Identify & Map Relevant Data Sources",
      description: "Identify relevant tables, fields, relationships, and data sources required to support the defined KPIs and analysis.",
      deliverable: "A structured view of the relevant data fields and relationships required for reliable analysis and reporting.",
      tools: ["SQL", "MySQL", "Data Relationship", "Multi-Table Analysis"],
    },
    {
      stepNumber: 4,
      stage: "Cleaning & Prep",
      phase: "Analytics",
      title: "Data Cleaning & Transformation",
      description: "Clean, validate, standardize, and transform raw datasets to prepare reliable data for analysis and Power BI reporting.",
      deliverable: "A cleaned and validated dataset with corrected formats, standardized values, and prepared fields for downstream analysis.",
      tools: ["SQL", "MySQL", "Power Query", "Python", "Pandas", "Numpy"],
    },
    {
      stepNumber: 5,
      stage: "Modeling & DAX",
      phase: "Analytics",
      title: "Build Data Models & Measures",
      description: "Build multi-table data models, establish relationships, and create DAX measures required for KPI and performance analysis.",
      deliverable: "A structured Power BI data model with relationships and DAX measures ready for interactive reporting.",
      tools: ["Power BI", "DAX", "Data Modeling", "Table Relationships"],
    },
    {
      stepNumber: 6,
      stage: "Visualization",
      phase: "Analytics",
      title: "Build Interactive Power BI Reports",
      description: "Design interactive Power BI dashboards with KPI cards, slicers, trend views, and drill-through analysis.",
      deliverable: "A clear visual report that allows users to explore KPIs, trends, comparisons, and segment-level performance.",
      tools: ["Power BI", "DAX", "KPIs cards", "Slicers", "Drill-through Navigation"],
    },
    {
      stepNumber: 7,
      stage: "Validation",
      phase: "Bridge",
      title: "Validate Data & Dashboard Results",
      description: "Validate transformed data, calculations, KPIs, and report outputs to ensure the final analysis is consistent and reliable.",
      deliverable: "A checked dataset and dashboard where key calculations, metrics, and reported insights have been reviewed for consistency.",
      tools: ["Data Validation", "Cross-Check Analysis", "KPIs Verification", "Data Quality Checks"],
    },
    {
      stepNumber: 8,
      stage: "Insights",
      phase: "Decision",
      title: "Deliver Decision-Ready Insights",
      description: "Translate validated analysis into clear trends, comparisons, KPIs, and findings that help stakeholders understand the data and make informed decisions.",
      deliverable: "A concise set of visual findings and actionable observations that make complex data easier for non-technical users to understand.",
      tools: ["KPIs Analysis", "Trend Analysis", "Data Validation", "Data Storytelling"],
    },
  ],
};
