import { portfolioKnowledgeBase, RESUME_SOURCE_URL, searchPortfolio } from '../data/knowledgeBase';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string; url?: string }[];
  relatedItems?: { type: 'project' | 'skill' | 'cert' | 'resume' | 'contact'; title: string; id?: string; url?: string }[];
}

export async function askPortfolioAssistant(
  userQuery: string,
  _activeProfile: 'data-analyst' = 'data-analyst',
  history: ChatMessage[] = []
): Promise<{ text: string; relatedItems?: any[]; quickActions?: any[] }> {
  // 1. Attempt server-side Gemini AI response with strict prompt grounding
  try {
    const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    const res = await fetch(`${apiBaseUrl}/api/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userQuery,
        activeProfile: 'data-analyst',
        portfolioContext: portfolioKnowledgeBase,
        history: history.map((h) => ({ sender: h.sender, text: h.text })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.reply && !data.fallback) {
        // Parse any associated quick action helpers based on the query
        const localQuickActions = getContextualQuickActions(userQuery);
        return {
          text: data.reply,
          quickActions: localQuickActions.quickActions,
          relatedItems: localQuickActions.relatedItems,
        };
      }
    }
  } catch (e) {
    console.debug('Switching to local grounded portfolio engine:', e);
  }

  // 2. Intelligent, Factual Local Engine (Strictly Grounded in Portfolio & Resume)
  return generateGroundedPortfolioResponse(userQuery);
}

function getContextualQuickActions(query: string): { quickActions?: any[]; relatedItems?: any[] } {
  const q = query.toLowerCase();
  const resumeUrl = RESUME_SOURCE_URL;

  if (q.includes('resume') || q.includes('cv')) {
    return {
      quickActions: [
        { label: 'View Resume', action: 'view_resume', url: resumeUrl },
        { label: 'Contact Me', action: 'go_contact' },
      ],
    };
  }

  if (q.includes('project') || q.includes('case study')) {
    return {
      quickActions: [
        { label: 'View All Projects', action: 'show_all_projects' },
        { label: 'View Skills', action: 'show_skills' },
      ],
    };
  }

  if (q.includes('skill') || q.includes('power bi') || q.includes('sql')) {
    return {
      quickActions: [
        { label: 'Explore Skills', action: 'show_skills' },
        { label: 'View Projects', action: 'show_all_projects' },
      ],
    };
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('reach')) {
    return {
      quickActions: [
        { label: 'Contact Form', action: 'go_contact' },
        { label: 'View Resume', action: 'view_resume', url: resumeUrl },
      ],
    };
  }

  return {
    quickActions: [
      { label: 'Profile', action: 'summarize_profile' },
      { label: 'Skills', action: 'show_skills' },
      { label: 'Projects', action: 'show_all_projects' },
      { label: 'Experience', action: 'show_experience' },
      { label: 'Resume', action: 'view_resume', url: resumeUrl },
    ],
  };
}

export function generateGroundedPortfolioResponse(
  query: string
): { text: string; relatedItems?: any[]; quickActions?: any[] } {
  const q = query.toLowerCase().trim();
  const { profile, skills, projects, experience, education, certifications } = portfolioKnowledgeBase;
  const resumeUrl = RESUME_SOURCE_URL;
  const displayName = profile.name && profile.name !== '[YOUR NAME]' ? profile.name : 'Data Analyst';

  // 1. Resume Specific Questions
  if (
    q === 'resume' ||
    q.includes('show me your resume') ||
    q.includes('show resume') ||
    q.includes('download resume') ||
    q.includes('view resume') ||
    q.includes('where is your cv') ||
    q.includes('google drive') ||
    q.includes('drive link') ||
    q.includes('resume link')
  ) {
    const isDrive = resumeUrl.includes('drive.google.com');
    return {
      text: `### Resume Source\n\n* **Role:** ${profile.primaryTitle}\n* **Source:** ${isDrive ? 'Configured Google Drive Document' : 'Official Portfolio Resume'}\n* **Access:** You can view or download the complete, up-to-date resume using the action below.\n\n*Feel free to review my verified projects, technical certifications, and work experience.*`,
      quickActions: [
        { label: 'View Resume', action: 'view_resume', url: resumeUrl },
        { label: 'Contact Me', action: 'go_contact' },
      ],
      relatedItems: [
        { type: 'resume', title: 'Curriculum Vitae / Resume', url: resumeUrl },
      ],
    };
  }

  // 2. Personal / Profile / Who is [Name] / Tell me about [Name]
  if (
    q.includes('who is') ||
    q.includes('who are you') ||
    q.includes('tell me about') ||
    q.includes('about ravi') ||
    q.includes('about you') ||
    q.includes('profile') ||
    q.includes('summarize profile') ||
    q.includes('who is ravi') ||
    q.includes('overview') ||
    q.includes('recruiter summary')
  ) {
    const topExp = experience[0];
    const topExpSummary = topExp
      ? `${topExp.role} (${topExp.duration}) with experience in Star Schema modeling, SQL query extraction, and automated dashboard delivery.`
      : `Data Analyst with deep focus on BI dashboards, SQL query optimization, and KPI performance modeling.`;

    const certList = certifications.slice(0, 2).map((c) => c.title).join(', ');

    return {
      text: `### About ${displayName}\n\n* **Role:** ${profile.primaryTitle}\n* **Focus:** Data Analytics, BI & KPI Reporting\n* **Key Tools:** Power BI, SQL, DAX, Excel, Data Modeling\n* **Experience:** ${topExpSummary}\n* **Certifications:** ${certList || 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)'}`,
      quickActions: [
        { label: 'View Skills', action: 'show_skills' },
        { label: 'Featured Projects', action: 'show_all_projects' },
        { label: 'View Resume', action: 'view_resume', url: resumeUrl },
      ],
    };
  }

  // 3. Specific Skill Inquiries
  const skillAliases: Record<string, string> = {
    'power bi': 'power-bi',
    'powerbi': 'power-bi',
    'sql': 'sql',
    'mysql': 'mysql',
    'sql server': 'sql-server',
    'mssql': 'sql-server',
    'dax': 'dax',
    'power query': 'power-query',
    'excel': 'excel',
    'python': 'python',
    'azure': 'azure',
    'data modeling': 'data-modeling',
    'star schema': 'data-modeling',
  };

  for (const [key, skillId] of Object.entries(skillAliases)) {
    if (q.includes(key)) {
      const foundSkill = skills.find((s) => s.id === skillId || s.name.toLowerCase().includes(key));
      if (foundSkill) {
        const associatedProjects = projects.filter((p) =>
          p.tools.some((t) => t.toLowerCase().includes(key)) ||
          p.skills.some((s) => s.toLowerCase().includes(key))
        );

        const projectNames = associatedProjects.length > 0
          ? associatedProjects.map((p) => p.title).slice(0, 2).join(', ')
          : 'Executive Sales & Revenue Intelligence';

        return {
          text: `### ${foundSkill.name}\n\n* **Level:** ${foundSkill.level || 'Advanced'}\n* **Applied Focus:** ${foundSkill.description}\n* **Key Techniques:** ${foundSkill.usedFor.slice(0, 4).join(', ')}\n* **Relevant Projects:** ${projectNames}`,
          quickActions: [
            { label: 'View Projects', action: 'show_all_projects' },
            { label: 'All Skills', action: 'show_skills' },
          ],
          relatedItems: associatedProjects.map((p) => ({ type: 'project' as const, title: p.title, id: p.id })),
        };
      }
    }
  }

  // 4. General Skills Inquiry
  if (
    q === 'skills' ||
    q.includes('what are your skills') ||
    q.includes('what skills') ||
    q.includes('tech stack') ||
    q.includes('technologies') ||
    q.includes('tools do you use') ||
    q.includes('technical skills')
  ) {
    return {
      text: `### Core Skills\n\n**BI & Visualization**\n* Power BI\n\n**Database & SQL**\n* SQL\n* MySQL\n* SQL Server\n* PostgreSQL\n\n**Analytics & Modeling**\n* DAX (Time Intelligence, CALCULATE)\n* Power Query (ETL & M Scripting)\n* Data Modeling (Star Schema & Snowflake)\n\n**Programming & Tools**\n* Python (Pandas & Data Manipulation)\n* Microsoft Excel (Advanced Pivot, Power Pivot)\n* Microsoft Azure\n* Git & Version Control`,
      quickActions: [
        { label: 'View Skills Section', action: 'show_skills' },
        { label: 'View Projects', action: 'show_all_projects' },
      ],
      relatedItems: [
        { type: 'skill', title: 'Power BI', id: 'power-bi' },
        { type: 'skill', title: 'SQL', id: 'sql' },
        { type: 'skill', title: 'DAX', id: 'dax' },
        { type: 'skill', title: 'Data Modeling', id: 'data-modeling' },
      ],
    };
  }

  // 5. Specific Project Inquiries
  const projectAliases = [
    { keys: ['sales', 'revenue'], id: 'sales-revenue-analytics' },
    { keys: ['hr', 'workforce', 'attrition', 'turnover'], id: 'hr-workforce-intelligence' },
    { keys: ['financial', 'budget', 'variance', 'p&l', 'finance'], id: 'financial-performance-analyzer' },
    { keys: ['cohort', 'retention', 'churn', 'customer'], id: 'customer-retention-cohort' },
  ];

  for (const alias of projectAliases) {
    if (alias.keys.some((k) => q.includes(k))) {
      const proj = projects.find((p) => p.id === alias.id);
      if (proj) {
        return {
          text: `### ${proj.title}\n\n**Objective**\n${proj.objective || proj.problem}\n\n**Tools**\n${proj.tools.join(' • ')}\n\n**Key Work**\n* ${proj.dataModeling || 'Engineered Star Schema architecture for sub-second query latency.'}\n* ${proj.analysis || 'Authored advanced DAX measures and interactive drill-through views.'}\n\n**Outcome**\n${proj.shortDescription}`,
          quickActions: [
            { label: 'View Project Details', action: 'view_project_' + proj.id },
            { label: 'All Projects', action: 'show_all_projects' },
          ],
          relatedItems: [{ type: 'project', title: proj.title, id: proj.id }],
        };
      }
    }
  }

  // 6. General Projects Inquiry
  if (
    q === 'projects' ||
    q.includes('tell me about your projects') ||
    q.includes('show me your projects') ||
    q.includes('featured projects') ||
    q.includes('portfolio work') ||
    q.includes('case studies') ||
    q.includes('what projects')
  ) {
    const list = projects
      .slice(0, 3)
      .map(
        (p, idx) =>
          `**${idx + 1}. ${p.title}**\n* **Purpose:** ${p.shortDescription}\n* **Tools:** ${p.tools.join(', ')}\n* **Key Work:** ${p.domain} analytics, Star Schema model & DAX KPIs.`
      )
      .join('\n\n');

    return {
      text: `### Featured Projects\n\n${list}`,
      quickActions: [
        { label: 'View Projects Section', action: 'show_all_projects' },
        { label: 'View Skills', action: 'show_skills' },
      ],
      relatedItems: projects.slice(0, 3).map((p) => ({ type: 'project', title: p.title, id: p.id })),
    };
  }

  // 7. Experience / Work History
  if (
    q === 'experience' ||
    q.includes('work experience') ||
    q.includes('career') ||
    q.includes('where do you work') ||
    q.includes('where does ravi work') ||
    q.includes('work history') ||
    q.includes('experience summary') ||
    q.includes('companies')
  ) {
    const expList = experience
      .map(
        (exp) =>
          `**${exp.company}**\n**${exp.role}** — ${exp.duration}\n${exp.responsibilities
            .slice(0, 3)
            .map((r) => `* ${r}`)
            .join('\n')}`
      )
      .join('\n\n');

    return {
      text: `### Work Experience\n\n${expList}`,
      quickActions: [
        { label: 'View Resume', action: 'view_resume', url: resumeUrl },
        { label: 'Featured Projects', action: 'show_all_projects' },
      ],
    };
  }

  // 8. Education Inquiries
  if (
    q.includes('education') ||
    q.includes('degree') ||
    q.includes('college') ||
    q.includes('university') ||
    q.includes('mca') ||
    q.includes('bca') ||
    q.includes('academic')
  ) {
    const eduList = education
      .map(
        (edu) =>
          `* **${edu.degree} (${edu.shortDegree})** — ${edu.institution || '[College/University]'}\n  * Specialization: ${edu.specialization}`
      )
      .join('\n');

    return {
      text: `### Education\n\n${eduList}`,
      quickActions: [
        { label: 'View Certifications', action: 'show_certifications' },
        { label: 'View Resume', action: 'view_resume', url: resumeUrl },
      ],
    };
  }

  // 9. Certification Inquiries
  if (
    q.includes('certif') ||
    q.includes('credential') ||
    q.includes('license') ||
    q.includes('pl-300') ||
    q.includes('pl300')
  ) {
    const certList = certifications
      .map((c) => `* **${c.title}** — ${c.issuer} (${c.issueDate})`)
      .join('\n');

    return {
      text: `### Verified Certifications\n\n${certList}`,
      quickActions: [
        { label: 'View All Skills', action: 'show_skills' },
        { label: 'View Resume', action: 'view_resume', url: resumeUrl },
      ],
      relatedItems: certifications.map((c) => ({ type: 'cert', title: c.title, id: c.id })),
    };
  }

  // 10. Contact Inquiries
  if (
    q === 'contact' ||
    q.includes('how can i contact') ||
    q.includes('contact you') ||
    q.includes('email') ||
    q.includes('hire') ||
    q.includes('reach out') ||
    q.includes('get in touch') ||
    q.includes('phone')
  ) {
    const whatsappLink =
      profile.whatsapp && profile.whatsapp.startsWith('http')
        ? profile.whatsapp
        : profile.whatsapp && profile.whatsapp !== 'YOUR_WHATSAPP_LINK'
        ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`
        : 'https://wa.me/';

    return {
      text: `### Contact Information\n\n* **Email:** ${profile.email}\n* **LinkedIn:** [LinkedIn Profile](${profile.socialLinks?.linkedin || profile.linkedin})\n* **GitHub:** [GitHub Repository](${profile.socialLinks?.github || profile.github})\n* **WhatsApp:** [Chat on WhatsApp](${whatsappLink})\n* **Location:** ${profile.location}`,
      quickActions: [
        { label: 'Open Contact Form', action: 'go_contact' },
        { label: 'View Resume', action: 'view_resume', url: resumeUrl },
      ],
    };
  }

  // 11. General Search across portfolio content
  const searchResults = searchPortfolio(query);
  if (searchResults.skills.length > 0 || searchResults.projects.length > 0) {
    let responseText = `### Portfolio Search: "${query}"\n\n`;
    if (searchResults.skills.length > 0) {
      responseText += `**Matching Skills:**\n${searchResults.skills
        .slice(0, 3)
        .map((s) => `* **${s.name}** — ${s.description.slice(0, 80)}...`)
        .join('\n')}\n\n`;
    }
    if (searchResults.projects.length > 0) {
      responseText += `**Matching Projects:**\n${searchResults.projects
        .slice(0, 2)
        .map((p) => `* **${p.title}** (${p.domain})`)
        .join('\n')}\n\n`;
    }
    return {
      text: responseText.trim(),
      quickActions: [
        { label: 'View Projects', action: 'show_all_projects' },
        { label: 'View Skills', action: 'show_skills' },
      ],
      relatedItems: [
        ...searchResults.skills.slice(0, 3).map((s) => ({ type: 'skill' as const, title: s.name, id: s.id })),
        ...searchResults.projects.slice(0, 2).map((p) => ({ type: 'project' as const, title: p.title, id: p.id })),
      ],
    };
  }

  // 12. Strict Unknown Handling (No hallucinations / fake assumptions)
  return {
    text: `I couldn't find that specific information in the current portfolio or resume.\n\nYou can check the **Resume** for the latest details or reach out directly via the **Contact** section.`,
    quickActions: [
      { label: 'Profile Summary', action: 'summarize_profile' },
      { label: 'View Skills', action: 'show_skills' },
      { label: 'View Projects', action: 'show_all_projects' },
      { label: 'View Resume', action: 'view_resume', url: resumeUrl },
      { label: 'Contact Me', action: 'go_contact' },
    ],
  };
}
