import { NextResponse } from 'next/server';

function localAnswer(rawPrompt: string): string {
  const prompt = rawPrompt.toLowerCase();

  if (prompt.includes('graphify')) {
    return 'Graphify is the visual map at the center of OrbitFlow. It draws your whole system as a live graph — projects, workflows, data, and AI actions as connected nodes — so instead of digging through files and menus, you see how everything connects and where things flow. It is the app\u2019s "visual operating system": if something changes in a project, you can watch the ripple move across the map.';
  }

  if (prompt.includes('product engine')) {
    return 'The Product Engine is Pillar 1 of OrbitFlow — the half that builds and ships. It covers source code and version history (the GitHub side), live sandbox-style iteration (the Replit side), the database and login system (the Supabase side), and the deployment pipeline that puts the app on the internet (the Vercel/Netlify side). If it creates, stores, or launches the product, it lives in the Product Engine.';
  }

  if (prompt.includes('ai ops')) {
    return 'The AI Ops Engine is Pillar 2 of OrbitFlow — the half that thinks and coordinates. It runs Graphify, the AI assistants and copilots, automation, and decision-making across the app. While the Product Engine does the building, the AI Ops Engine watches the whole system, explains it (that\u2019s my job), and keeps the moving parts working together instead of drifting apart.';
  }

  if (prompt.includes('pillar')) {
    return 'OrbitFlow stands on two pillars, shown as the big boxed modules on the dashboard. Pillar 1, the Product Engine, builds and ships: code, database, and deployments. Pillar 2, the AI Ops Engine, thinks and coordinates: Graphify, the AI assistants, and automation. The idea is simple — one pillar makes the product, the other keeps it smart and smooth, and I\u2019m the agent who can explain both.';
  }

  if (prompt.includes('deploy') || prompt.includes('vercel') || prompt.includes('netlify') || prompt.includes('live')) {
    return 'Deploying means putting the app on the internet so a link works. OrbitFlow\u2019s code lives on GitHub, and Vercel watches that code: every time a change is committed, Vercel rebuilds the app and publishes the new version automatically — usually in under a minute. Netlify can do the same job; Vercel is used here because it is made by the Next.js team, so this app runs smoothest on it.';
  }

  if (prompt.includes('smooth') || prompt.includes('stable') || prompt.includes('healthy') || prompt.includes('health') || prompt.includes('keep')) {
    return 'Three things keep OrbitFlow smooth. First, the two-pillar split: building (Product Engine) and thinking (AI Ops Engine) never fight over the same job. Second, the health panels on the dashboard — App Health, AI Score, and the Operations pulse — watch source flow, data integrity, and deploy response in real time, so problems show up before they break anything. Third, the deploy pipeline is automatic and repeatable, so every update ships the exact same safe way.';
  }

  if (prompt.includes('supabase') || prompt.includes('database') || prompt.includes('data') || prompt.includes('auth')) {
    return 'Supabase is the data layer inside the Product Engine. It provides the database that stores projects and workspace state, plus the login/auth system, with real-time updates when data changes. In this demo build the dashboard runs on built-in sample data; wiring a real Supabase project is the step that makes your projects and login permanent.';
  }

  if (prompt.includes('login') || prompt.includes('dashboard') || prompt.includes('personal') || prompt.includes('account')) {
    return 'The dashboard is your personal command center — this OrbitFlow build is a single-user workspace made for you, not a public product. It brings together the workspace overview, the Graphify map, both pillars, your task board, and the operations pulse in one place. The login screen is a demo gate in this version; real accounts arrive when Supabase Auth is wired in.';
  }

  if (prompt.includes('unlimited')) {
    return 'The "unlimited" badge means this personal build has no artificial usage caps built into the app itself — it\u2019s your own workspace, so there\u2019s no plan tier metering you. Real-world limits would only come from outside services (like an AI provider\u2019s key or a hosting plan) if you connect them later.';
  }

  if (
    prompt.includes('explain') ||
    prompt.includes('what is orbitflow') ||
    prompt.includes('what is this app') ||
    prompt.includes('how does this app work') ||
    prompt.includes('how does orbitflow work') ||
    prompt.includes('overview')
  ) {
    return 'OrbitFlow is your personal AI product studio — one dashboard that blends the best parts of the tools you use: GitHub for code history, Replit for live iteration, Supabase for database and login, Next.js for the app itself, Vercel for putting it online, and AI copilots like me for planning and explaining. It stands on two pillars — the Product Engine (build and ship) and the AI Ops Engine (think and coordinate) — with the Graphify map in the center showing how it all connects. Ask me about any piece and I\u2019ll break it down.';
  }

  return 'I\u2019m the Pillar Agent — I know this app inside out. I can explain: the app as a whole ("Explain the app"), Pillar 1 ("What is the Product Engine?"), Pillar 2 ("What is the AI Ops Engine?"), the visual map ("How does Graphify work?"), how it ships ("How does deploying work?"), or what keeps it running ("What keeps the app smooth?"). Try one of those.';
}

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = body.prompt || '';

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ text: localAnswer(prompt) }, { status: 200 });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are the Pillar Agent for OrbitFlow. Explain the app architecture, Product Engine, AI Ops Engine, Graphify, deployment flow, and how the whole system stays smooth and understandable.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ text: localAnswer(prompt) }, { status: 200 });
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? localAnswer(prompt);

  return NextResponse.json({ text });
}
