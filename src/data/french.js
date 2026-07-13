import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const configured =
    !!SUPABASE_URL &&
    !!SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('placeholder')

export const supabase = configured
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null

export async function loadState() {
    if (!configured) return { ok: false, reason: 'not_configured' }
    try {
        const { data, error } = await supabase
            .from('command_center')
            .select('*')
            .eq('id', 'sajja_singleton')
            .single()
        if (error) throw error
        return { ok: true, data }
    } catch (err) {
        return { ok: false, reason: 'unreachable', message: err.message }
    }
}

export async function saveState(state) {
    if (!configured) return { ok: false, reason: 'not_configured' }
    try {
        const { error } = await supabase
            .from('command_center')
            .upsert({
                id: 'sajja_singleton',
                eb1a_tasks: state.eb1a?.tasks || {},
                eb1a_evidence: state.eb1a?.evidence || [],
                dm_tasks: state.dm?.tasks || {},
                dm_mod_prog: state.dm?.modProg || {},
                dm_metrics: state.dm?.metrics || [],
                plan_done_days: state.plan?.doneDays || {},
                streak: state.streak || 0,
                last_visit: state.lastVisit || null,
                workspace: state.workspace || 'eb1a',
                updated_at: new Date().toISOString(),
            })
        if (error) throw error
        return { ok: true }
    } catch (err) {
        return { ok: false, reason: 'unreachable', message: err.message }
    }
}

// ── French TEF Canada — data layer ──────────────────────────────

export const FRENCH_MODES = [
    { id: 'vocab', label: 'Vocabulary', icon: '📖', color: 'var(--blue)', clb: 'CLB 7 target' },
    { id: 'grammar', label: 'Grammar', icon: '📝', color: 'var(--blue)', clb: 'CLB 7 target' },
    { id: 'speaking', label: 'Speaking', icon: '🗣️', color: 'var(--red)', clb: 'CLB 7 target' },
    { id: 'listening', label: 'Listening', icon: '🎧', color: 'var(--green)', clb: 'CLB 7 target' },
    { id: 'mock', label: 'TEF Mock', icon: '🎯', color: 'var(--amber)', clb: 'CLB 7 target' },
]

export const FRENCH_TASKS = [
    { id: 'enroll_laforet', title: 'Enroll in La Forêt TEF batch (16 Jul 2026)', tags: [{ label: 'urgent', type: 'high' }] },
    { id: 'setup_anki', title: 'Download Anki + French Top 5000 deck', tags: [{ label: 'setup', type: 'med' }] },
    { id: 'setup_notebook', title: 'Buy physical notebook for mistake log', tags: [{ label: 'setup', type: 'med' }] },
    { id: 'rfi_bookmark', title: 'Bookmark RFI Savoirs (rfi.fr/fr/savoirs)', tags: [{ label: 'setup', type: 'med' }] },
    { id: 'fa_subscribe', title: 'Subscribe to Français Authentique on YouTube/Spotify', tags: [{ label: 'setup', type: 'med' }] },
    { id: 'tef_exam_date', title: 'Book TEF Canada exam date at Alliance Française (~Apr 2027)', tags: [{ label: 'critical', type: 'high' }] },
    { id: 'phase1_benchmark', title: 'Record Phase 1 voice benchmark (end of Week 4)', tags: [{ label: 'milestone', type: 'gold' }] },
    { id: 'phase2_benchmark', title: 'Record Phase 2 voice benchmark (end of Week 9)', tags: [{ label: 'milestone', type: 'gold' }] },
    { id: 'phase3_final', title: 'Record final Day 90 benchmark', tags: [{ label: 'milestone', type: 'gold' }] },
    { id: 'pr_q1', title: 'Memorize PR Q1: Présentez-vous', tags: [{ label: 'speaking', type: 'purple' }] },
    { id: 'pr_q2', title: 'Memorize PR Q2: Pourquoi le Canada?', tags: [{ label: 'speaking', type: 'purple' }] },
    { id: 'pr_q3', title: 'Memorize PR Q3: Décrivez votre travail', tags: [{ label: 'speaking', type: 'purple' }] },
    { id: 'pr_q4', title: 'Memorize PR Q4: Comment vous intégrer?', tags: [{ label: 'speaking', type: 'purple' }] },
    { id: 'pr_q5', title: 'Memorize PR Q5: Parlez de votre famille', tags: [{ label: 'speaking', type: 'purple' }] },
    { id: 'pr_q6', title: 'Memorize PR Q6: Vos projets au Canada?', tags: [{ label: 'speaking', type: 'purple' }] },
    { id: 'pr_q7', title: 'Memorize PR Q7: Valeurs canadiennes?', tags: [{ label: 'speaking', type: 'purple' }] },
    { id: 'pr_q8', title: 'Memorize PR Q8: Pourquoi Mississauga?', tags: [{ label: 'speaking', type: 'purple' }] },
]

export const SYSTEM_PROMPTS = {
    vocab: `You are a strict but encouraging French language coach helping Sajja (Indian professional in Mississauga) prepare for TEF Canada. He is a complete A0 beginner targeting CLB 7 for Canadian PR via Express Entry.

VOCABULARY mode rules:
- Give ONE French word per turn, relevant to Canadian PR/daily life/work
- Format: **[word]** — pronunciation in simple phonetics — English meaning — one short example sentence
- After he types the word back correctly: "✓ Correct! Next:" then give the next word
- If wrong: show the error gently, explain, ask him to try again
- Keep responses under 6 lines. No fluff.
- Tone: firm coach, direct, warm. Like a trainer who believes in you but won't let you slide.
- Start by giving him his first word immediately.`,

    grammar: `You are a strict French grammar coach helping Sajja prepare for TEF Canada. He is an A0 beginner in Mississauga, full-time worker, doing an MBA.

GRAMMAR mode rules:
- Pick one tense/rule per session (rotate: présent → passé composé → imparfait → futur → conditionnel)
- Explain the rule in exactly 2 lines
- Give 3 fill-in-the-blank sentences using his real context (Canada, his IT job, immigration, Mississauga)
- Correct each answer immediately after he responds
- Keep each response under 7 lines
- Tone: direct coach reviewing game tape. Specific corrections, no sugarcoating, but never discouraging.
- Ask which tense he wants, or pick one if he says "you choose".`,

    speaking: `You are a TEF Canada speaking examiner coaching Sajja for his oral expression exam. He is an A0 beginner building toward CLB 7 for Canadian PR.

SPEAKING mode rules:
- Give ONE of the 8 core PR questions (rotate through all 8):
  1) Présentez-vous 2) Pourquoi le Canada? 3) Décrivez votre travail 4) Comment vous intégrer? 5) Parlez de votre famille 6) Vos projets au Canada? 7) Valeurs canadiennes? 8) Pourquoi Mississauga?
- Accept French or mixed French/English (he's a beginner — be realistic)
- Score on: Content /5 · Grammar /5 · Vocabulary /5 · Fluency /5
- Show scores, what he lost and why, then a corrected model answer in French
- Push him to try again with the improved version
- Tone: examiner who wants him to pass but won't pretend a weak answer is good.
- Start by giving today's question.`,

    listening: `You are a TEF Canada listening coach for Sajja, a complete beginner targeting CLB 7.

LISTENING mode rules:
- Give a SHORT French passage (3–5 sentences) on PR/Canada/daily life — write it clearly
- Then ask 3 comprehension questions in English
- He answers in English (comprehension, not production)
- Score: correct / partial / incorrect per question
- After all 3: show key vocabulary he should have caught
- Next round: slightly harder passage
- Keep passages SHORT — he is a beginner
- Tone: encouraging but rigorous. Wrong answers corrected clearly, not softened.
- Give the first passage immediately.`,

    mock: `You are a strict TEF Canada examiner running a mock oral production exam for Sajja, A0 beginner targeting CLB 7 for Canadian PR (Express Entry).

MOCK EXAM rules — TEF Canada Oral Production format, 4 scoring criteria:
- Pertinence (content relevance) /5
- Cohérence (structure and logic) /5
- Lexique (vocabulary range) /5
- Morphosyntaxe (grammar accuracy) /5
- Total: /20

Your job:
- Give a TEF-style speaking prompt (monologue OR dialogue — rotate)
- He types his response (French or mixed — be realistic for his beginner level)
- Score all 4 criteria, show exactly what he lost and why
- Give model answer in correct French
- State approximate CLB level his answer represents
- Rotate: monologue (describe a place, argue a position, tell a story) vs dialogue (bank, job interview, landlord, immigration officer)
- Tone: fair examiner. Precise. No score inflation.
- Start with: "TEF Canada Mock Exam — Oral Production" then give the prompt.`,
}
