export const EB1A_CRITERIA = [
  {
    id: 'judging',
    name: 'Judging the Work of Others',
    desc: 'Serving as a judge at hackathons, conferences, or peer review panels. USCIS wants volume and prestige.',
    progress: 40,
    evidenceHint: 'Hackonomics 2026 application, DeveloperWeek NY application, acceptance emails, judging certificates',
    next: 'Follow up on hackathon judge applications. Apply to 2 more: MLH hackathons, AWS Build-On hackathon.'
  },
  {
    id: 'original',
    name: 'Original Contributions of Major Significance',
    desc: 'Work that materially influenced your field. querytuner.com, incopilot CLI, autoshiftops.com articles.',
    progress: 55,
    evidenceHint: 'GitHub stars/forks on incopilot, querytuner usage metrics, LinkedIn acknowledgments, article comments',
    next: 'Get 3 external practitioners to write testimonials about querytuner impact on their workflow.'
  },
  {
    id: 'published',
    name: 'Published Material in Major Media',
    desc: 'Articles published in recognized outlets. DZone, The New Stack, InfoQ are solid targets.',
    progress: 50,
    evidenceHint: 'DZone confirmation, The New Stack submissions, InfoQ articles, view counts, LinkedIn impressions (1700+)',
    next: 'Follow up on all submitted articles. Target 2 more outlets: Dev.to, Towards Data Science.'
  },
  {
    id: 'critical',
    name: 'Critical or Essential Role in Distinguished Organizations',
    desc: 'Your Application Architect role at TechMahindra serving a major client. Document that your role was essential.',
    progress: 30,
    evidenceHint: 'Client contracts showing named role, org charts, letters from client leadership, project outcomes',
    next: 'Request letter from client-side manager describing your essential role and project impact.'
  },
  {
    id: 'salary',
    name: 'High Salary or Remuneration',
    desc: 'Compensation significantly above average for your field in Canada. Compare against Canadian ICT averages.',
    progress: 20,
    evidenceHint: 'Pay stubs, T4/tax documents, offer letter, Statistics Canada ICT salary showing top 10-15%',
    next: 'Pull Statistics Canada or PayScale data for Application Architects in Ontario. Document the differential.'
  }
]

export const EB1A_TASKS = [
  { id: 'e1', title: 'Follow up on Hackonomics 2026 judge application — email organizers', priority: 'high', crit: 'judging' },
  { id: 'e2', title: 'Apply to 2 additional hackathon judge roles (MLH, AWS Build-On)', priority: 'high', crit: 'judging' },
  { id: 'e3', title: 'Collect 3 testimonials from practitioners who used querytuner.com', priority: 'high', crit: 'original' },
  { id: 'e4', title: 'Export querytuner.com usage metrics and GitHub incopilot stats', priority: 'high', crit: 'original' },
  { id: 'e5', title: 'Follow up on DZone article submission status', priority: 'high', crit: 'published' },
  { id: 'e6', title: 'Follow up on The New Stack and InfoQ submissions', priority: 'med', crit: 'published' },
  { id: 'e7', title: 'Submit 2 new articles to Dev.to and Towards Data Science', priority: 'med', crit: 'published' },
  { id: 'e8', title: 'Request reference letter from client-side manager at current project', priority: 'high', crit: 'critical' },
  { id: 'e9', title: 'Gather org chart and contract showing Application Architect title', priority: 'med', crit: 'critical' },
  { id: 'e10', title: 'Pull Statistics Canada ICT salary data for Ontario — document differential', priority: 'med', crit: 'salary' },
  { id: 'e11', title: 'Organize all evidence into Google Drive binder by criterion', priority: 'high', crit: 'all' },
  { id: 'e12', title: 'Write 2-page personal statement of extraordinary ability', priority: 'high', crit: 'all' },
  { id: 'e13', title: 'Consult immigration lawyer with completed evidence binder', priority: 'high', crit: 'all' },
  { id: 'e14', title: 'Continue LinkedIn posting schedule — min 2 posts/week', priority: 'med', crit: 'published' },
  { id: 'e15', title: 'Submit CFP to one more conference — DevOpsCon or KubeCon', priority: 'med', crit: 'published' },
]
