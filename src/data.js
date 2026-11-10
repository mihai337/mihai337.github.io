import {
  siRaspberrypi, siDebian, siCplusplus, siPython, siSpringboot, siKotlin, siNodedotjs,
  siOpenapiinitiative, siPostgresql, siMysql, siRedis, siFirebase, siReact, siTypescript,
  siJavascript, siFlutter, siDart, siAndroid, siJetpackcompose, siTerraform, siDocker,
  siKubernetes, siGithubactions, siNginx, siLangchain, siHuggingface, siPytorch, siOpencv,
  siMilvus,
} from 'simple-icons'

export const contact = {
  email: 'constantinm7787@gmail.com',
  phone: '+40756229242',
  phoneLabel: '+40 756 229 242',
  whatsapp: 'https://wa.me/40756229242',
  linkedin: 'https://www.linkedin.com/in/mihai-constantin-113586285',
  github: 'https://github.com/mihai337',
  cv: '/Mihai_Constantin_CV.pdf',
}

export const experience = [
  {
    company: 'Nokia',
    role: 'Working student, software engineer',
    when: 'Aug 2025 - now',
    points: [
      'Build features and maintain C++ code, and trace defects to decide whether the root cause is in our code or in an external component.',
      'Refactor and clean up code for non-functional improvements.',
      'Verify every change with C++ unit tests and Python software component tests against the specification.',
      'Keep the code documentation current in reStructuredText.',
    ],
  },
  {
    company: 'DevPlant',
    role: 'Assistant analyst',
    when: 'Jun 2024 - Jun 2025',
    points: [
      'Developed and maintained Spring Boot backend services.',
      'Contributed to AWS infrastructure defined as code with Terraform.',
      'Built a complete Python backend that sends invoices automatically.',
      'Upgraded a large React project to current technologies.',
      'Built a browser extension for managing application performance results.',
    ],
  },
]

export const volunteering = [
  { org: 'Google Developer Student Club', role: 'DevOps', note: "Deployed the team's application to a Kubernetes cluster." },
  { org: 'Eviden, AC Labs', role: 'Cloud SecOps' },
]

// Photos are licensed Wikimedia Commons stand-ins; swap for real screenshots when available.
export const projects = [
  {
    title: 'AI Contract Risk Analyser',
    kind: "Bachelor's thesis",
    stack: 'Kotlin, Java, Spring Boot, Python, PostgreSQL, pgvector, Milvus, LangChain, Hugging Face',
    text: 'Reads a contract, extracts its clauses, maps how they relate to each other and flags the risky ones in a structured analysis.',
    img: '/img/contract.webp',
    alt: 'A pen resting on a signed legal contract',
  },
  {
    title: 'Smart Reminder',
    kind: 'Mobile app',
    stack: 'Flutter, Dart, Java, Spring Boot, PostgreSQL, Redis, Firebase Auth',
    text: 'Reminders that trigger by location, time or Wi-Fi network, using Android background services and notifications on top of a REST API.',
    img: '/img/phone.webp',
    alt: 'A hand holding a smartphone',
  },
  {
    title: 'Smart Medicine Dispenser',
    kind: 'Full-stack system',
    stack: 'Kotlin, Jetpack Compose, Spring Boot, PostgreSQL, Firebase Auth, OpenAI API, Raspberry Pi 5',
    text: 'A medication platform: an Android app and a REST backend with AI-assisted adherence analysis, driving a physical dispenser.',
    img: '/img/pills.webp',
    alt: 'A weekly pill organizer filled with tablets and capsules',
  },
  {
    title: 'Self-hosted Homelab',
    kind: 'Infrastructure',
    stack: 'Raspberry Pi, Debian, Docker, Portainer, Pi-hole, Nginx Proxy Manager',
    text: 'Containerised services on a Raspberry Pi behind a reverse proxy, each on its own subdomain, with ad blocking for the whole network.',
    img: '/img/pi.webp',
    alt: 'A Raspberry Pi 5 single-board computer',
  },
  {
    title: 'Asociația Valea Mureșului',
    kind: 'Website',
    stack: 'HTML, CSS, JavaScript, Firebase Hosting, Authentication, Firestore',
    text: 'A presentation website for a cultural association, with dedicated sections for its dance and football groups.',
    img: '/img/dance.webp',
    alt: 'Women in traditional Romanian costume dancing',
  },
]

export const layers = [
  {
    name: 'Backend',
    text: 'Spring Boot and Node.js services behind REST APIs described in OpenAPI, plus complete Python backends like automated invoice sending.',
    tools: [['Java'], ['Spring Boot', siSpringboot], ['Kotlin', siKotlin], ['Node.js', siNodedotjs], ['Python', siPython], ['OpenAPI', siOpenapiinitiative], ['Firebase Auth', siFirebase]],
  },
  {
    name: 'Frontend',
    text: 'React and TypeScript on the web, Flutter and Jetpack Compose on mobile, and the patience to upgrade a large React codebase.',
    tools: [['React', siReact], ['TypeScript', siTypescript], ['JavaScript', siJavascript], ['Flutter', siFlutter], ['Dart', siDart], ['Android', siAndroid], ['Jetpack Compose', siJetpackcompose]],
  },
  {
    name: 'Data',
    text: 'Relational, key-value and document stores behind the apps, plus vector search with pgvector and Milvus.',
    tools: [['PostgreSQL', siPostgresql], ['MySQL', siMysql], ['Redis', siRedis], ['Firestore', siFirebase], ['pgvector'], ['Milvus', siMilvus]],
  },
  {
    name: 'Cloud',
    text: 'AWS infrastructure written in Terraform, Docker images, Kubernetes deployments and GitHub Actions pipelines.',
    tools: [['AWS'], ['Terraform', siTerraform], ['Docker', siDocker], ['Kubernetes', siKubernetes], ['GitHub Actions', siGithubactions], ['Nginx', siNginx], ['Debian', siDebian]],
  },
  {
    name: 'AI',
    text: 'Models wired into real products: LangChain pipelines, Hugging Face models and the OpenAI API.',
    tools: [['LangChain', siLangchain], ['Hugging Face', siHuggingface], ['PyTorch', siPytorch], ['OpenAI API'], ['OpenCV', siOpencv]],
  },
  {
    name: 'Systems',
    text: 'C++ at Nokia: new features, maintenance and defect hunting, with every change proven by unit tests and Python component tests.',
    tools: [['C++', siCplusplus], ['C#'], ['reStructuredText'], ['Raspberry Pi', siRaspberrypi]],
  },
]

export const builds = [
  'Banking web app with a message broker',
  'Contract generator, containerised and deployed',
  'Version control system with file snapshots',
  'Browser extension for downloading video',
  'Image-processing scripts with OpenCV',
  'Smart irrigation on a Raspberry Pi',
]

export const education = [
  { when: '2026 - now', school: 'Politehnica University of Timișoara', what: 'M.Eng., Digital Media and Web Development' },
  { when: '2022 - 2026', school: 'Politehnica University of Timișoara', what: 'B.Sc., Computers and Information Technology (English programme), Faculty of Automation and Computers' },
  { when: '2018 - 2022', school: 'National College "Preparandia - Dimitrie Țichindeal", Arad', what: 'Mathematics and Computer Science' },
]

export const courses = ['Terraform for AWS, Beginner to Expert (Udemy)', 'Advanced Programming Techniques (UPT)', 'IC3 (Certiport)']
export const languages = ['English, professional working (B2)', 'Romanian, native']
