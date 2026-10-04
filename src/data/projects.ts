import { Project } from '../types';

export const projectsData: Project[] = [
  // ==================== DATA ANALYST PROJECTS ====================
  {
    id: "tesla-global-business-performance-dashboard",
    profile: "data-analyst",
    title: "Tesla Global Business Performance Dashboard (2015–2025)",
    category: "EV & Automotive Analytics",
    domain: "EV & Automotive Analytics",
    shortDescription: "Interactive multi-page Power BI dashboard analyzing Tesla's global business performance from 2015 to 2025, covering production, estimated deliveries, pricing, vehicle range, battery capacity, regional performance, and CO₂ savings across Tesla models.",
    description: "An interactive multi-page Power BI analytics solution that explores Tesla's global business performance across production, estimated deliveries, pricing, vehicle specifications, regional performance, and environmental impact from 2015 to 2025.",
    problem: "Tesla operates globally across multiple vehicle models and regions. Decision-makers needed a centralized way to analyze production, estimated deliveries, pricing, vehicle specifications, regional performance, and environmental impact over time without relying on fragmented reporting sources.",
    objective: "Build an interactive Power BI analytics solution using Tesla data from 2015–2025, allowing users to explore global production, deliveries, pricing, vehicle specifications, regional performance, and environmental impact through dynamic filters and KPI-driven visualizations.",
    dataset: "Kaggle Tesla vehicle-related dataset in Excel/CSV format covering 2015–2025, including Year, Month, Region, Model, Estimated_Deliveries, Production_Units, Avg_Price_USD, Battery_Capacity_kWh, Range_km, CO2_Saved_tons, Source_Type, and Charging_Stations.",
    dataPrep: "Downloaded the Tesla dataset from Kaggle, performed exploratory data analysis, checked the column structure, identified missing values and duplicates, validated data consistency, cleaned and formatted the dataset using Microsoft Excel, converted the cleaned data to CSV, imported it into Power BI, and applied additional transformations with Power Query.",
    dataModeling: "Developed a structured analytical model using Tesla production and delivery data, creating relationships between key dimensions such as Year, Model, and Region to support comparative performance analysis and KPI aggregation.",
    dataModelDescription: "A clean analytical model built for dynamic filtering and KPI evaluation, supporting visual exploration of production, delivery trends, regional performance, and model-level specifications across multiple years.",
    analysis: "Conducted exploratory data analysis, analyzed production and delivery trends over time, compared regional and model-level performance, evaluated average selling price, battery capacity, and driving range, and assessed CO₂ savings using interactive Power BI filters and DAX measures.",
    codeSnippets: [
      {
        type: "DAX",
        title: "Total Deliveries",
        code: `Total Deliveries =
SUM(Estimated_Deliveries)`,
        explanation: "Calculates the total number of estimated Tesla deliveries across the selected time, region, and model context.",
      },
      {
        type: "DAX",
        title: "YoY Deliveries Growth %",
        code: `YoY Deliveries Growth % =
VAR CurrentDeliveries = [Total Deliveries]
VAR PriorYearDeliveries =
    CALCULATE(
        [Total Deliveries],
        FILTER(
            ALL(Year),
            Year[Year] = MAX(Year[Year]) - 1
        )
    )
RETURN
    DIVIDE(
        CurrentDeliveries - PriorYearDeliveries,
        PriorYearDeliveries,
        0
    )`,
        explanation: "Calculates year-over-year change in Tesla estimated deliveries while respecting the selected time and filter context.",
      },
      {
        type: "SQL",
        title: "Regional Delivery Summary",
        code: `SELECT
    Year,
    Region,
    Model,
    SUM(Estimated_Deliveries) AS Total_Deliveries,
    SUM(Production_Units) AS Total_Production,
    AVG(Avg_Price_USD) AS Avg_Price_USD,
    SUM(CO2_Saved_tons) AS Total_CO2_Saved
FROM Tesla_Data
GROUP BY Year, Region, Model
ORDER BY Year, Region, Model;`,
        explanation: "Aggregates Tesla model and regional production, delivery, pricing, and CO₂ savings metrics into a clean summary dataset for Power BI reporting.",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
        title: "Tesla Global Overview",
        description: "High-level view of Tesla's business performance across production, deliveries, and key market indicators.",
        tag: "Executive",
      },
      {
        url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        title: "Model Performance Comparison",
        description: "Vehicle performance analysis comparing range, price, and battery capacity across major Tesla models.",
        tag: "Detail",
      },
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        title: "Regional Delivery View",
        description: "Regional Tesla delivery trend analysis highlighting market contribution and business performance across geographies.",
        tag: "Drill-through",
      },
      {
        url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
        title: "Data Model & KPIs",
        description: "Analytical model supporting KPI measurement, dimensions, and interactive filters for Tesla business tracking.",
        tag: "Data Model",
      },
    ],
    keyInsights: [
      "Tesla produced approximately 28M vehicles and delivered approximately 26M vehicles globally across the analyzed period.",
      "Average vehicle pricing remains around $84K–$86K, while average driving range is approximately 500 km across the analyzed Tesla models.",
      "Tesla vehicles contributed approximately 1.96M tons of CO₂ savings, highlighting the environmental impact represented in the dataset.",
    ],
    recommendations: [
      "Use model and regional delivery trends to identify high-performing markets and support future production and distribution planning.",
      "Monitor vehicle pricing, battery capacity, and range together to evaluate model-level positioning and identify performance differences across regions.",
      "Use scheduled Power BI refreshes and interactive filters to maintain up-to-date performance monitoring and reduce dependency on manual analysis.",
    ],
    outcome: "The dashboard provides an interactive view of Tesla's global business performance, enabling users to analyze production, deliveries, model performance, regional trends, vehicle specifications, and CO₂ savings through centralized Power BI reporting.",
    tools: ["Power BI", "Power Query", "DAX", "Excel", "GitHub"],
    skills: ["Data Modeling", "Time Intelligence", "Dashboard Design", "KPI Analysis", "Market Performance Analysis"],
    dashboardUrl: "https://app.powerbi.com/view?r=YOUR-TESLA-POWER-BI-LINK",
    liveDashboardUrl: "https://app.powerbi.com/view?r=YOUR-TESLA-POWER-BI-LINK",
    githubUrl: "https://github.com/Ravi10300/Tesla-Global-Business-Performance-Dashboard-2015-2025",
    videoUrl: "https://www.youtube.com/watch?v=YOUR-TESLA-VIDEO-LINK",
    videoPlatform: "youtube",
    featured: true,
  },
  {
    id: "hr-workforce-intelligence",
    profile: "data-analyst",
    title: "Zomato Analytics Dashboard",
    category: "Food Delivery Analytics",
    domain: "Food Delivery Analytics",
    shortDescription: "An end-to-end data analytics project that transforms raw Zomato food delivery data into meaningful insights using Excel, MySQL, and Power BI. The interactive dashboard helps stakeholders track operational metrics, customer satisfaction, discount usage, and regional trends for smarter business decisions.",
    description: "An end-to-end data analytics project that transforms raw Zomato food delivery data into meaningful insights using Excel, MySQL, and Power BI. The interactive dashboard helps stakeholders track operational metrics, customer satisfaction, discount usage, and regional trends for smarter business decisions.",
    problem: "Zomato food delivery data contains multiple operational and customer-related metrics, making it difficult to monitor order performance, delivery efficiency, customer ratings, discount usage, and regional trends from raw data alone. The dashboard provides a centralized analytical view to identify customer behavior, restaurant performance, delivery trends, and discount utilization.",
    objective: "Analyze Zomato food delivery data to understand customer behavior and preferences, monitor restaurant performance and delivery trends, measure discount utilization, and provide data-driven insights through an interactive Power BI dashboard.",
    dataset: "Zomato food delivery dataset containing order, delivery, rating, discount, cuisine, regional, and time-based attributes.",
    dataPrep: "Imported the raw Zomato CSV data into MySQL Workbench, converted date formats, removed irrelevant fields such as review text, created a discount-applied indicator, and prepared a clean reporting table. The cleaned data was then connected to Power BI for data modeling, DAX calculations, and interactive dashboard development.",
    dataModeling: "MySQL was used to clean and structure the Zomato dataset before connecting the prepared data to Power BI for reporting, KPI calculations, interactive visuals, filters, and slicers.",
    dataModelDescription: "A structured reporting model designed for quick exploration of order flow, delivery efficiency, discount usage, ratings, and regional trends using Power BI visuals and filters.",
    analysis: "Analyzed order volume, delivery time, customer ratings, discount utilization, cuisine preferences, regional trends, and time-based order patterns to identify operational and customer behavior insights.",
    codeSnippets: [
      {
        type: "DAX",
        title: "Discount Utilization %",
        code: `Discount Utilization % =
DIVIDE(
    [Discounted Orders],
    [Total Orders],
    0
)`,
        explanation: "Calculates the percentage of total Zomato orders where a discount was applied, supporting analysis of discount usage and customer behavior.",
      },
      {
        type: "DAX",
        title: "Average Delivery Time",
        code: `Average Delivery Time =
AVERAGE([Delivery Time])`,
        explanation: "Measures the average time taken to complete a delivery across regions, cuisines, and time periods.",
      },
    ],
    images: [
      {
        url: "/assets/projects/hr-dashboard-exec.png",
        title: "Workforce Overview & Turnover Scorecard",
        description: "Executive KPI display showing active headcount, turnover rate, retention cost, and satisfaction indexes.",
        tag: "Executive",
      },
      {
        url: "/assets/projects/hr-dashboard-attrition.png",
        title: "Attrition Root-Cause Deep Dive",
        description: "Interactive scatter plot and heatmaps analyzing attrition by tenure band and compensation percentile.",
        tag: "Detail",
      },
    ],
    keyInsights: [
      "Nearly half of the orders used discounts, with 4,991 discounted orders out of 10,000 total orders, resulting in a 49.91% discount utilization rate.",
      "Certain regions experienced longer delivery times, highlighting opportunities to investigate regional delivery efficiency and operational performance.",
      "Indian cuisine was the most frequently ordered cuisine, while weekends and holidays showed higher order volumes, indicating clear customer preference and time-based demand patterns.",
    ],
    recommendations: [
      "Monitor regional delivery-time trends to identify locations with consistently slower deliveries and improve operational efficiency.",
      "Evaluate discount utilization by customer and region to understand campaign effectiveness while balancing order volume and discount dependency.",
      "Use cuisine and time-based order trends to support restaurant planning, promotional campaigns, and demand forecasting.",
    ],
    outcome: "This project demonstrates a complete BI workflow from raw Zomato data to cleaned MySQL data, Power BI modeling, DAX calculations, interactive dashboards, and actionable business insights. It showcases practical skills in SQL, Power BI, Excel, DAX, and data storytelling.",
    tools: ["Excel (CSV)", "MySQL", "Power BI", "DAX"],
    skills: ["Data Cleaning", "SQL", "Power BI", "DAX", "Data Storytelling"],
    dashboardUrl: "https://app.powerbi.com/view?r=YOUR-ZOMATO-POWER-BI-LINK",
    githubUrl: "https://github.com/Ravi10300/Zomato-Analytics-Dashboard",
    videoUrl: "https://github.com/Ravi10300/Zomato-Analytics-Dashboard/blob/main/Dashboard%20-%20Video.mp4",
    videoPlatform: "direct",
    featured: true,
  },
  {
    id: "financial-performance-analyzer",
    profile: "data-analyst",
    title: "Hotel Revenue Optimization – Python Project",
    category: "Hospitality / Revenue Analytics",
    domain: "Hospitality / Revenue Analytics",
    shortDescription: "An end-to-end Python data analytics project analyzing hotel booking cancellations to identify key trends, patterns, and actionable solutions that can help optimize revenue and reduce cancellation rates.",
    description: "An end-to-end Python data analytics project analyzing hotel booking cancellations to identify key trends, patterns, and actionable solutions that can help optimize revenue and reduce cancellation rates.",
    problem: "Hotel booking cancellations can negatively affect revenue and occupancy planning. The project analyzes booking data to identify the key factors and patterns associated with cancellations.",
    objective: "Identify factors influencing hotel booking cancellations, analyze the impact of pricing, seasonality, and location on cancellations, provide actionable recommendations to minimize cancellations, and use data visualization to support insights and decision-making.",
    dataset: "The dataset contains hotel booking information including booking details, pricing information, time-based trends, customer information, market segments, hotel type, cancellation status, and reservation details.",
    dataPrep: "Loaded the hotel booking dataset into Python, used Pandas for data cleaning and manipulation, explored booking and cancellation patterns, analyzed pricing, seasonality, hotel type, and customer-related factors, and used Matplotlib and Seaborn for data visualization in a Jupyter Notebook.",
    dataModeling: "Exploratory data analysis structure focused on hotel booking attributes, cancellation status, pricing, seasonality, hotel type, and customer behavior using Python and Pandas.",
    dataModelDescription: "Exploratory data analysis structure focused on hotel booking attributes, cancellation status, pricing, seasonality, hotel type, and customer behavior using Python and Pandas.",
    analysis: "Analyzed cancellation patterns by hotel type, pricing, seasonality, lead time, location, customer type, and booking characteristics using Pandas, Matplotlib, and Seaborn. The analysis focuses on identifying patterns that can help hotels reduce cancellations and improve revenue management decisions.",
    codeSnippets: [
      {
        type: "Python",
        title: "Cancellation Rate by Hotel Type",
        code: `# Cancellation rate by hotel type
cancellation_rate = (
    df.groupby("hotel")["is_canceled"]
      .mean()
      .sort_values(ascending=False)
)`,
        explanation: "Calculates the cancellation rate by hotel type to compare cancellation patterns between Resort Hotel and City Hotel bookings.",
      },
    ],
    images: [
      {
        url: "/assets/projects/finance-dashboard-exec.png",
        title: "P&L Executive Summary",
        description: "Interactive income statement visual with expandable revenue, COGS, OpEx, and EBITDA lines.",
        tag: "Executive",
      },
      {
        url: "/assets/projects/finance-dashboard-variance.png",
        title: "Cost Center Budget Burn-Down",
        description: "Variance waterfall chart illustrating quarterly budget burn and overspend drivers by department.",
        tag: "Detail",
      },
    ],
    keyInsights: [
      "Higher cancellations were observed in Resort Hotels, indicating an opportunity for targeted pricing and promotional strategies.",
      "Higher daily rates are associated with increased cancellation behavior, highlighting the importance of competitive and demand-based pricing.",
      "January records the highest cancellation activity in the analysis, suggesting an opportunity for targeted seasonal marketing and retention campaigns.",
    ],
    recommendations: [
      "Adjust pricing strategies by considering location and demand to offer more competitive rates.",
      "Introduce seasonal promotions and targeted discounts during periods with higher cancellation activity.",
    ],
    outcome: "This analysis provides valuable insights into hotel booking trends and cancellation behavior, helping businesses make informed decisions around pricing, seasonal promotions, customer engagement, and revenue optimization.",
    tools: ["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter Notebook"],
    skills: ["Python Analysis", "Data Cleaning", "Exploratory Data Analysis", "Business Insights", "Visualization"],
    dashboardUrl: "https://app.powerbi.com/view?r=YOUR-TESLA-POWER-BI-LINK",
    githubUrl: "https://github.com/Ravi10300/hotel-revenue-optimization-Python-Project",
    videoUrl: "https://github.com/Ravi10300/hotel-revenue-optimization-Python-Project/blob/main/Dashboard%20-%20Video.mp4",
    videoPlatform: "direct",
    featured: true,
  },
  {
    id: "customer-retention-cohort",
    profile: "data-analyst",
    title: "Indian Agriculture Analysis Dashboard",
    category: "Agriculture Analytics",
    domain: "Agriculture Analytics",
    shortDescription: "Interactive Power BI dashboard analyzing agricultural production across states, districts, crops, seasons, and crop years to provide a clear view of production trends and regional performance.",
    description: "Interactive Power BI dashboard analyzing agricultural production across states, districts, crops, seasons, and crop years to provide a clear view of production trends and regional performance.",
    problem: "Understanding agricultural production across multiple states, districts, crops, seasons, and years can be difficult when production data is spread across different dimensions. A centralized dashboard is needed to analyze production patterns and compare regional performance efficiently.",
    objective: "Develop an interactive Power BI dashboard to analyze agricultural production by state, district, crop, season, and crop year, while providing key production KPIs and filtering capabilities.",
    dataset: "The dashboard analyzes agricultural production information with dimensions including State_Name, District_Name, Crop, Crop_Year, Season, and Production.",
    dataPrep: "Prepared agricultural production data for analysis in Power BI, focusing on state, district, crop, season, and year-based comparisons using interactive dashboard modeling and filter-driven analysis.",
    dataModeling: "A Power BI analytical structure designed to compare agricultural production across state, district, crop, season, and crop-year dimensions.",
    dataModelDescription: "A Power BI analytical structure designed to compare agricultural production across state, district, crop, season, and crop-year dimensions.",
    analysis: "Analyzed agricultural production patterns across states, districts, crops, seasons, and crop years using interactive Power BI visuals, KPI cards, filters, and comparative production views.",
    codeSnippets: [
      {
        type: "DAX",
        title: "Total Production",
        code: `Total Production =
SUM('Agriculture'[Production])`,
        explanation: "Analyzes agricultural production totals across different geographic, crop, seasonal, and yearly dimensions in Power BI.",
      },
    ],
    images: [
      {
        url: "/assets/projects/cohort-dashboard.png",
        title: "Customer Cohort Retention Matrix",
        description: "Heatmap matrix visual displaying customer retention rates across 18 monthly cohorts.",
        tag: "Executive",
      },
    ],
    keyInsights: [
      "The dashboard provides a consolidated view of agricultural production across 33 states and 646 districts.",
      "Production can be analyzed across 122 crops and multiple seasons, including Kharif, Rabi, Winter, Summer, and Autumn.",
      "Year and state filters allow users to explore production trends and compare agricultural output across different time periods and regions.",
    ],
    recommendations: [
      "Use state- and district-level production comparisons to identify regions that require deeper agricultural analysis and planning.",
      "Monitor crop and seasonal production trends over time to support more informed agricultural planning and resource allocation.",
    ],
    outcome: "This Power BI dashboard provides a structured view of Indian agricultural production, enabling exploration of production trends across states, districts, crops, seasons, and years.",
    tools: ["Power BI"],
    skills: ["Agricultural Analytics", "Dashboard Design", "Production Analysis", "Power BI"],
    dashboardUrl: "https://app.powerbi.com/view?r=YOUR-INDIAN-AGRICULTURE-POWER-BI-LINK",
    liveDashboardUrl: "https://app.powerbi.com/view?r=YOUR-INDIAN-AGRICULTURE-POWER-BI-LINK",
    githubUrl: "https://github.com/Ravi10300/Indian-Agriculture-Analysis-Dashboard",
    videoUrl: "https://example.com/indian-agriculture-dashboard-video",
    videoPlatform: "direct",
    featured: false,
  },
  {
    id: "new-analytics-project-coming-soon",
    profile: "data-analyst",
    title: "Upcoming Analytics Project",
    category: "Data Analytics",
    domain: "Data Analytics",
    shortDescription: "An additional hands-on data analytics project is currently in development and will be added soon, expanding the portfolio with another practical analytics case study.",
    description: "An additional hands-on data analytics project is currently in development and will be added soon, expanding the portfolio with another practical analytics case study.",
    problem: "This project is currently in development. The final business problem, analytical objectives, and project scope will be added once the analysis is completed.",
    objective: "Develop another practical analytics case study focused on data cleaning, exploratory analysis, dashboard development, and business-oriented insight generation.",
    dataset: "Dataset and technical implementation are currently being finalized. Detailed data preparation, analytical methods, and technical implementation will be documented soon.",
    dataPrep: "Dataset and technical implementation are currently being finalized. Detailed data preparation, analytical methods, and technical implementation will be documented soon.",
    dataModeling: "This project is currently in development. The final structure, data model, and technical implementation will be documented once the analysis is finalized.",
    dataModelDescription: "This project is currently in development. Data preparation, analytical structure, and technical implementation will be documented once the analytical work is complete.",
    analysis: "Key analytical insights and business implications will be added after the analysis is completed and validated.",
    codeSnippets: [
      {
        type: "Python",
        title: "Project in Development",
        code: `# Project is currently in development
# Final analysis and dashboard logic will be added soon`,
        explanation: "Placeholder code block for an analytics project currently being finalized; the final technical implementation will be added once the work is complete.",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        title: "Upcoming Analytics Project Preview",
        description: "Preview image for an upcoming analytics case study currently under development.",
        tag: "Main",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        title: "Data Analysis Workflow",
        description: "Placeholder analytics workflow visual demonstrating the project's future dashboard and reporting structure.",
        tag: "Detail",
      },
    ],
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    ],
    keyInsights: [
      "This project is currently in development and will be added to the portfolio once the analysis is finalized.",
      "Detailed insights, KPIs, and business findings will be documented as part of the final project case study.",
      "The final deliverable will include a completed analytical workflow, dashboard logic, and business-ready recommendations.",
    ],
    recommendations: [
      "Actionable recommendations will be documented after the final analysis and validation of the project results.",
      "Finalize the data model, cleaning workflow, and analytical approach before publishing the case study.",
      "Add the final dashboard, validation notes, and recommendations after the project is fully developed.",
    ],
    businessOutcome: "Currently in development — detailed project scope, analysis, dashboard, and case study will be added soon.",
    outcome: "Currently in development — detailed project scope, analysis, dashboard, and case study will be added soon.",
    tools: ["Coming Soon"],
    skills: ["Data Cleaning", "Exploratory Analysis", "Dashboard Development", "Business Insights"],
    featured: false,
  },
];
