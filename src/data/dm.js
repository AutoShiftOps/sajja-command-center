export const DM_MODULES = [
  { id:'M1', num:'01', name:'Market & Customer Intelligence', desc:'Who buys, why they buy, what words they use. The foundation.', theory:'STP, Buyer Personas, Jobs-To-Be-Done', active:true },
  { id:'M2', num:'02', name:'SEO & Content Marketing', desc:'How Google ranks you. Content that earns traffic while you sleep.', theory:'Keyword Intent, Content Clusters, On-Page SEO, Content Decay', active:true },
  { id:'M3', num:'03', name:'Social Media Marketing', desc:'Pinterest, Instagram, TikTok — algorithms and organic growth.', theory:'Content Calendar, Platform Algorithms, Organic Growth', active:true },
  { id:'M4', num:'04', name:'Email Marketing', desc:'The channel you own. Lists, automated flows, CLV increase.', theory:'CLV Theory, Drip Sequences, Segmentation, A/B Testing', active:false },
  { id:'M5', num:'05', name:'Paid Advertising', desc:'Amplify what works. Meta Ads, Google Shopping, ROAS.', theory:'ROAS, CAC, Campaign Structure, Creative Testing', active:false },
  { id:'M6', num:'06', name:'Analytics & Optimization', desc:'Read data before spending money. GA4, CVR, A/B testing.', theory:'GA4, CRO, Funnel Analysis, Attribution', active:false },
]

export const DM_TASKS = [
  { id:'d1', title:'Remove 3 clothing products from seoulandglow.com', mod:'Phase 0', priority:'high' },
  { id:'d2', title:'Rename all 15 jewelry products with brand-aligned names', mod:'M1', priority:'high' },
  { id:'d3', title:'Set minimum price floor of $18 CAD on all products', mod:'Phase 0', priority:'high' },
  { id:'d4', title:'Write About Us brand story page', mod:'M1', priority:'high' },
  { id:'d5', title:'Fix social links — YouTube and Twitter still point to Shopify defaults', mod:'Phase 0', priority:'high' },
  { id:'d6', title:'Set up Google Analytics 4 on Shopify', mod:'M6', priority:'high' },
  { id:'d7', title:'Set up Google Search Console and verify seoulandglow.com', mod:'M2', priority:'high' },
  { id:'d8', title:'Create CJdropshipping account and install Shopify app', mod:'Phase 0', priority:'med' },
  { id:'d9', title:'Import 10 dainty chain necklaces from CJdropshipping', mod:'Phase 0', priority:'med' },
  { id:'d10', title:'Import 10 earring sets from CJdropshipping', mod:'Phase 0', priority:'med' },
  { id:'d11', title:'Build one-page customer persona document for Seoul & Glow', mod:'M1', priority:'high' },
  { id:'d12', title:'Research 20 keywords — Korean jewelry Canada — using Ubersuggest', mod:'M2', priority:'med' },
  { id:'d13', title:'Write blog post 1: "What is K-jewelry? The Korean jewelry aesthetic"', mod:'M2', priority:'med' },
  { id:'d14', title:'Set up Klaviyo and connect to Shopify store', mod:'M4', priority:'med' },
  { id:'d15', title:'Create Pinterest business account and 5 boards', mod:'M3', priority:'med' },
  { id:'d16', title:'Pin first 10 products to Pinterest boards', mod:'M3', priority:'med' },
  { id:'d17', title:'Write blog post 2: "Best nickel-free necklaces for sensitive skin Canada"', mod:'M2', priority:'med' },
  { id:'d18', title:'Post first Instagram Reel — product showcase', mod:'M3', priority:'med' },
  { id:'d19', title:'Set up 3-email welcome flow in Klaviyo', mod:'M4', priority:'med' },
  { id:'d20', title:'Write blog post 3: "How to layer necklaces the Korean way"', mod:'M2', priority:'med' },
]

export const DM_CONCEPTS = [
  { title:'STP Framework', mod:'M1', body:'Segmentation, Targeting, Positioning. Segment the market, target your best segment, position your brand specifically for them.', formula:'Segment → Target → Position', action:'Seoul & Glow: Segment = women 22–38 in Canada. Target = K-beauty followers. Position = "Korean-inspired minimalist jewelry, nickel-free, everyday elegance."' },
  { title:'Keyword Intent', mod:'M2', body:'Every Google search has intent: Informational (learning), Transactional (ready to buy), Commercial (comparing). Target all stages of the funnel.', formula:'Informational → Blog posts | Transactional → Product pages', action:'"How to layer necklaces Korean style" → Blog post. "Buy minimalist gold necklace Canada" → Product page.' },
  { title:'Content Cluster', mod:'M2', body:'One pillar page on a broad topic, supported by 8–12 shorter articles, all internally linked. Google rewards topical authority over breadth.', formula:'Pillar Page → 10 Articles → Internal Links → Topical Authority → Rankings', action:'Pillar: "Complete Guide to Korean Minimalist Jewelry." 10 supporting articles all linking back.' },
  { title:'Content Decay', mod:'M2', body:'Content that ranked well loses traffic over time as competitors publish fresher material. Monthly audits catch this early.', formula:'Monitor clicks monthly → Flag pages down >20% → Refresh content → Recover rankings', action:'Monthly Search Console export. Compare this month vs last. Refresh anything dropping. That LinkedIn post you saw — this is exactly it.' },
  { title:'Customer Lifetime Value', mod:'M4', body:'Total revenue one customer generates over their relationship with your brand. Increasing CLV is almost always more profitable than acquiring new customers.', formula:'CLV = Avg Order Value × Purchase Frequency × Customer Lifespan', action:'Seoul & Glow: $35 × 3/year × 2 years = $210 CLV. Email marketing increases purchase frequency. That is why email ROI is 40:1.' },
  { title:'ROAS', mod:'M5', body:'Return on Ad Spend. For every $1 spent on ads, how many dollars in revenue come back? Below 2x means not profitable yet. 3x+ means scale it.', formula:'ROAS = Revenue from Ads ÷ Ad Spend', action:'Spend $50 Meta Ads, generate $120 sales → ROAS = 2.4x. That is your baseline. Beat it before increasing budget.' },
  { title:'Conversion Rate (CVR)', mod:'M6', body:'% of website visitors who make a purchase. E-commerce average is 1–3%. Improving by 1% doubles revenue without spending more on traffic.', formula:'CVR = (Orders ÷ Sessions) × 100', action:'500 visitors, 3 orders → CVR = 0.6%. Product pages need work. Improve photos, descriptions, pricing clarity.' },
  { title:'Email Open Rate & CTR', mod:'M4', body:'Open rate = % who open your email. CTR = % who click inside. Subject line drives open rate. Content and offer drive CTR.', formula:'Open Rate = Opens ÷ Delivered × 100 | CTR = Clicks ÷ Opens × 100', action:'In Klaviyo: A/B test subject lines — send A to 20%, B to 20%, winner to remaining 60%. Live experimentation.' },
]

export const DM_WEEKLY = [
  { day:'Monday', time:'30 min', color:'#c9a84c', tasks:['Enter last week\'s metrics in My Metrics tab','Read one concept card to re-activate marketing thinking'] },
  { day:'Tuesday', time:'45 min', color:'#5a9de8', tasks:['Complete one unchecked item from the Task Board','If no pending task: write 200 words of a blog post'] },
  { day:'Wednesday', time:'30 min', color:'#4caf7d', tasks:['Post one piece of content (Instagram Reel, TikTok, or Pinterest pins)','Engage with 5 comments on your social posts'] },
  { day:'Thursday', time:'45 min', color:'#5a9de8', tasks:['Complete one more Task Board item','Check Google Search Console — note any keyword movement'] },
  { day:'Friday', time:'30 min', color:'#e8a020', tasks:['Write or finish one blog post (400 words minimum)','Pin 5 product images to Pinterest boards'] },
  { day:'Saturday', time:'20 min', color:'#c9a84c', tasks:['One sentence: what did you ship this week?','Pick next week\'s single focus task'] },
  { day:'Sunday', time:'OFF', color:'#606060', tasks:['Rest. The compound effect works even when you don\'t.'] },
]

export const DM_METRICS_FIELDS = [
  { id:'traffic', name:'Website Sessions', tool:'Google Analytics 4' },
  { id:'cvr', name:'Conversion Rate %', tool:'Shopify Analytics' },
  { id:'orders', name:'Orders', tool:'Shopify' },
  { id:'revenue', name:'Revenue (CAD)', tool:'Shopify' },
  { id:'email_or', name:'Email Open Rate %', tool:'Klaviyo' },
  { id:'ig_reach', name:'Instagram Reach', tool:'Instagram Insights' },
  { id:'pinterest', name:'Pinterest Monthly Views', tool:'Pinterest Analytics' },
  { id:'blog_clicks', name:'Blog Clicks from Google', tool:'Search Console' },
]
