/** Real freelancer images used across the marketing site and dashboard. */
export const IMG = {
  // Hero / general
  heroFreelancer: "/assets/freelancers/freelancer_4.jpg", // woman with laptop on balcony overlooking sea
  heroLaptop: "/assets/freelancers/freelancer_7.jpg", // close-up typing & stock chart phone
  workspace: "/assets/freelancers/freelancer_12.jpg", // over-the-shoulder stock graphs
  team: "/assets/freelancers/freelancer_9.jpg", // team of three working on laptops
  coffeeShop: "/assets/freelancers/freelancer_13.jpg", // two colleagues working in bright room
  marketStall: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80",
  // Categories
  webDev: "/assets/freelancers/freelancer_1.jpg",
  designer: "/assets/freelancers/freelancer_2.jpg",
  copywriter: "/assets/freelancers/freelancer_5.jpg",
  seo: "/assets/freelancers/freelancer_8.jpg",
  social: "/assets/freelancers/freelancer_6.jpg",
  video: "/assets/freelancers/freelancer_3.jpg",
  photo: "/assets/freelancers/freelancer_10.jpg",
  marketing: "/assets/freelancers/freelancer_11.jpg",
  appDev: "/assets/freelancers/freelancer_12.jpg",
  va: "/assets/freelancers/freelancer_13.jpg",
  // Faces — for testimonials & team. Real people photos.
  face1: "/assets/freelancers/freelancer_11.jpg", // Taiwo Adeyemi (black man in suit outdoors)
  face2: "/assets/freelancers/freelancer_4.jpg", // Maria Silva (woman on sea-view balcony)
  face3: "/assets/freelancers/freelancer_8.jpg", // James Kariuki (man sitting on park bench)
  face4: "/assets/freelancers/freelancer_1.jpg", // Priya Patel (South Asian man sitting outside in pink shirt)
  face5: "/assets/freelancers/freelancer_5.jpg", // Alex Johnson / Lucas Fernández (man with turban)
  face6: "/assets/freelancers/freelancer_6.jpg", // Sofia Romano (young woman with pink hair on balcony)
  face7: "/assets/freelancers/freelancer_2.jpg", // Kenji (man typing on laptop)
  face8: "/assets/freelancers/freelancer_10.jpg", // Sofia / other (man with glasses and lamp)
  // Blog images
  blog1: "/assets/freelancers/freelancer_1.jpg",
  blog2: "/assets/freelancers/freelancer_2.jpg",
  blog3: "/assets/freelancers/freelancer_3.jpg",
  blog4: "/assets/freelancers/freelancer_4.jpg",
  blog5: "/assets/freelancers/freelancer_5.jpg",
  blog6: "/assets/freelancers/freelancer_6.jpg",
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  author: string;
  authorAvatar: string;
  date: string;
  readMins: number;
  category: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "first-five-cold-emails",
    title: "The first 5 cold emails I sent as a freelance web developer",
    excerpt: "What worked, what flopped, and the script I now use on every Monday morning.",
    body: `When I started freelancing in Lagos in 2023, I had a portfolio of exactly three projects (all mock sites for fictional businesses) and zero client leads. Cold emailing felt incredibly awkward. The idea of writing to strangers, pitching my services, and hoping they wouldn't yell at me or block my address kept me frozen for weeks. But cold email was the only honest, zero-cost way to start a pipeline without spending money on ads or racing to the bottom on bidding platforms.

What I didn't realize back then was that my initial attempts were mathematically destined to fail. I had to send five distinct cold emails to learn the hard truth about client psychology. The difference between a pitch that gets deleted and a message that starts a $3,000 project comes down to three sentences.

Here is the exact chronicle of the first five cold emails I sent, why the first four crashed, and the formula I now use every Monday morning to land high-value clients.

### Email 1: The 400-Word Resume (The Silent Death)
My very first cold email was sent to a local pharmacy chain. I spent three hours polishing it. It was a 400-word essay detailing my educational background, my proficiency in React, Node.js, and Tailwind CSS, and a long paragraph about my work ethic. I ended it with: "Please let me know if you have any web development needs."

**The Result:** Total silence. No reply, no bounce, nothing.
**Why it flopped:** This email was entirely about *me*. The pharmacy owner does not care about my stack, my grades, or my life story. They care about their inventory, their sales, and their customers. A wall of text that requires them to do homework (decide what "needs" they might have) goes straight to the archive.

### Email 2: The Generic Compliment Fluff (The Transparent Lie)
For my second attempt, I wrote to a high-end coffee shop in Victoria Island. I decided to be "friendly." I started the email with: "I love your cafe, your coffee is the best in Lagos!" then quickly pivoted: "By the way, your website looks really old and has bad navigation. I can redesign it for you."

**The Result:** Read receipt received. No reply.
**Why it flopped:** The compliment was obviously fake fluff. I had never actually visited that cafe because I lived two hours away. Business owners are highly sensitive to false flattery. If you start your pitch with a lie, they will assume your work is equally dishonest. Worse, calling their website "old and bad" puts them on the defensive. Nobody likes being told their baby is ugly by a stranger.

### Email 3: The Multi-Step Homework Pitch (The Friction Trap)
I wrote to a boutique hotel next. I made a list of ten things wrong with their website and wrote a detailed technical breakdown of how their slow loading speed was hurting their search engine rankings. I ended with: "Let's get on a 30-minute Zoom call this Wednesday at 2:00 PM to discuss a complete optimization roadmap."

**The Result:** Silence.
**Why it flopped:** I asked for a massive commitment. A 30-minute call with an unverified stranger is a huge cognitive load for a busy hotel manager. I also gave them a laundry list of technical problems that felt overwhelming. Instead of helping, I created a chore.

### Email 4: The Discount Bribe (The Value Killer)
Desperate for a reply, I wrote to a local accounting firm. I kept the email short: "I am a local web developer. I can build you a new website for 50% off my normal rate. Just $200. Let me know if you are interested."

**The Result:** No reply.
**Why it flopped:** Dropping your price before a client even asks signals that your work has low value. If you offer a 50% discount out of nowhere, it suggests you are either desperate or your skills are subpar. Price is never the starting point of a professional relationship.

### Email 5: The Three-Sentence Value Gift (The Breakthrough)
By the fifth email, I was exhausted and stopped trying to sound like an agency. I wrote to a popular bakery in Surulere. I looked at their site on my phone and saw their menu was a large 10MB PDF that took 45 seconds to download over local data connections. 

I wrote three sentences:
1. **The Specific Observation:** "Hey, I was trying to order some cupcakes on my phone and noticed your menu PDF takes about 45 seconds to download on mobile data."
2. **The Frictionless Gift:** "I took your menu text and built a quick, mobile-friendly page that loads instantly. You can test it out here: [link]."
3. **The Low-Pressure Close:** "If you like how it works, I can transfer the code to your site for free, no catch. Let me know if you'd like to use it."

**The Result:** A reply in 17 minutes from the owner: "This is brilliant. How much to do the rest of the site?" That contract turned into my first $1,200 project.

---

### The Anatomy of the Three-Sentence Formula
After sending hundreds of outreach messages since then, I have systemized this fifth email into a reliable framework. It works because it respects the recipient's time and provides immediate, undeniable value.

#### Sentence 1: The Objective Observation
Start with a neutral, verifiable fact about their business. Do not flatter, and do not insult. Just state what you saw from a user's perspective.
*   *Good:* "I noticed the booking link on your Google Maps listing goes to a broken page."
*   *Bad:* "Your website is terrible and I want to fix it."

#### Sentence 2: The Value Gift
Show, don't tell. Instead of explaining what you *could* do, do a tiny portion of the work upfront. Build a single mockup page, write a copy draft, or record a 30-second video pointing out the exact solution. This proves you have already invested time in their business before asking for theirs.

#### Sentence 3: The Frictionless Close
End with a low-pressure, binary question that requires a simple yes or no. Never ask for a meeting or a call in the first email. The goal is to start a conversation, not to close a sale.
*   *Good:* "Would it be alright if I sent over the design draft to see if it fits your brand?"
*   *Bad:* "Let's jump on a discovery call next Tuesday at 10 AM."

### Establishing a Consistent Outreach Habit
Cold emailing is a numbers game, but not in the way most people think. Sending 100 generic automated emails via spambots will yield a 0% response rate and ruin your domain reputation. Sending 5 highly researched, personalized, manual emails every single morning will build a pipeline that feeds your business for years. 

Set a timer for 30 minutes every morning. Search your local area for businesses with specific, fixable digital gaps. Write to them using the three-sentence formula. Treat them like human business owners, not leads in a database. When you focus on solving their real, commercial problems rather than selling your stack, you will never have to chase clients again.`,
    cover: IMG.blog1,
    author: "Taiwo Adeyemi",
    authorAvatar: IMG.face1,
    date: "May 21, 2026",
    readMins: 7,
    category: "Outreach",
  },
  {
    slug: "scoring-leads-without-ai",
    title: "How to score leads without fancy AI",
    excerpt: "A back-of-the-envelope framework for ranking businesses before you reach out.",
    body: `Lead scoring is often talked about as if it requires expensive enterprise software or complex AI algorithms. But the truth is that lead scoring is simply a qualification framework. It is a structured way of answering a single, vital question before you open your inbox: *Is this business actually worth my time to pitch?*

When I started out as a freelance consultant, I spent my first six months writing to every business I could find on Google Maps. I emailed bakeries, accountants, dental clinics, and construction firms. I was sending twenty pitches a day, working late into the night, but my response rate was under 3%. I was exhausted, discouraged, and close to giving up.

The turning point came when I realized I was wasting my energy on low-opportunity prospects. I needed a systematic way to separate the warm, high-value leads from the cold, unresponsive ones. I developed a simple, manual lead scoring system using a basic Google Sheet. I used this spreadsheet framework for two years before any AI got involved. It took my response rate from 3% to over 35%.

Here is the exact step-by-step scoring system you can use to filter your prospect list and find the clients who are ready to hire you today.

### The Problem with Unqualified Lists
The biggest mistake freelancers make is pitching by volume. They buy a scraped database of 10,000 businesses, write a generic template, and blast it out. This approach fails for three main reasons:
1. **High Bounce Rates:** Scraped databases are often filled with dead emails, which flags your domain as a spammer and kills your future email deliverability.
2. **Lack of Context:** You don't know if the business has a budget, if they just hired a web agency, or if they even care about their digital presence.
3. **No Personalization:** Business owners receive dozens of spam emails a day. If your email looks like it was sent to 500 other people, they will hit delete in less than a second.

Manual lead scoring solves this by forcing you to research a business *before* you reach out. By the time you write the email, you know exactly what their digital gaps are, making your pitch highly relevant and impossible to ignore.

### The Base 50 Scoring Checklist
To implement this, open a spreadsheet and create columns for: Company Name, Website URL, Phone Number, Core Digital Gap, and Base Score. 

Start every new prospect at a baseline score of **50 points**. From there, you will add or subtract points based on specific criteria you observe during a quick 2-minute audit of their online presence:

#### Positive Indicators (Opportunities to Add Value)
*   **No website at all (+15 points):** The ultimate lead. They are completely invisible online and are losing customers to competitors who have websites.
*   **Not mobile-friendly (+15 points):** Over 60% of local search traffic happens on mobile devices. If their site requires pinching and zooming to read the menu or find the phone number, they are actively leaking leads.
*   **Broken core features (+20 points):** Try to use their contact form or booking link. If it returns an error page, they have a broken pipeline. You can fix this immediately and save them lost revenue.
*   **Outdated design or copyright year (+10 points):** If their footer still says "Copyright 2018" or their layout looks like it was built in the early 2000s, it indicates they have neglected their digital storefront.
*   **Inactive social channels (+10 points):** If their last Instagram or Facebook post was two years ago, it shows they lack the internal time or resources to manage their online presence.

#### Negative Indicators (Red Flags to Avoid)
*   **Active job postings for full-time developers (-15 points):** If they are hiring a full-time in-house developer or designer, they are not looking for a freelancer. They want a salaried employee.
*   **Low Google Ratings or poor reputation (-15 points):** If a business has a 2.5-star rating on Google with complaints about poor service, they likely have operational problems that a new website cannot fix. They may also be difficult clients to manage.
*   **Corporate agency footprint (-20 points):** Check their website footer. If it says "Website designed by [Major Global Agency]," they likely have an active, expensive retainer contract with an agency. You will not be able to compete with that budget.

### Analyzing the Scores: Gold, Silver, and Trash
Once you have scored 20 or 30 local businesses in a specific niche, sort your spreadsheet by the final score column. Your prospects will fall into three distinct tiers:

*   **Gold Leads (Score 75+):** These are your top priorities. They have active, severe digital problems (broken forms, no mobile responsiveness) but appear to be active businesses. Pitch to these leads first using a highly customized value gift.
*   **Silver Leads (Score 60-74):** These are good prospects. They have working websites but could benefit from modern layout designs, speed optimizations, or updated copywriting. Use a standard low-pressure outreach formula here.
*   **Trash Leads (Score below 60):** Do not waste your time pitching to these businesses. They either have a dedicated internal team, a major agency contract, or operational issues that make them high-risk, low-budget clients. Delete them from your sheet.

### The 30-Minute Weekly Workflow
To keep your freelance sales pipeline healthy without burning out, set up a simple weekly routine:
*   **Sunday Evening (Research & Score):** Spend 30 minutes searching for 15-20 local businesses in a specific trade (e.g., HVAC contractors in Chicago, or bakeries in Madrid). Score them using the checklist and drop them into your sheet.
*   **Monday through Friday (Outreach):** Every morning, take the top 2 gold leads from your sheet. Spend 10 minutes writing a personalized, three-sentence email to each. 

By committing to this habit, you are sending only 10 highly targeted, qualified pitches a week. But because these prospects have been scored and qualified, your response rate will be exponentially higher than a bulk campaign. You will spend less time writing pitch letters and more time doing high-paying work for clients who genuinely need your help.`,
    cover: IMG.blog2,
    author: "Maria Silva",
    authorAvatar: IMG.face2,
    date: "May 14, 2026",
    readMins: 7,
    category: "Sales",
  },
  {
    slug: "pricing-as-a-new-freelancer",
    title: "Pricing as a new freelancer (without underselling yourself)",
    excerpt: "Three pricing mistakes I made in my first year — and what I'd do differently.",
    body: `My first website design cost the client $80. It took me 32 hours of design, code, and revisions. That is $2.50 per hour. It was less than a coffee in Naples. I was working day and night, but I could barely pay my bills.

I made every pricing mistake in the book. Here are the three lessons that changed my business.

## 1. Stop Charging by the Hour
When you charge by the hour, you are penalized for being fast. If you get better and finish a site in 5 hours instead of 10, you get paid half as much. Charge by the project instead. Focus on the value you bring to the business.

Hourly billing sets up a fundamentally adversarial relationship between you and your client. The client wants the project completed as quickly as possible to minimize their bill, which naturally leads to them questioning every single hour logged on your invoice. Meanwhile, you want to take your time to ensure quality (and make a living wage), meaning you are incentivized to work slower. This is a recipe for constant conflict and suspicion.

Furthermore, hourly rates cap your earning potential. There are only 24 hours in a day, and even the most seasoned freelancers can only bill a fraction of those hours after accounting for administration, sales, and breaks. If your pricing is tied solely to your hours, your business cannot scale without you raising your rates to astronomical heights that mid-tier clients cannot afford.

The solution is Value-Based Pricing or Project-Based Pricing. When you price by the project, you charge for the deliverable and the outcomes, not the hours. This aligns incentives: the faster and more efficiently you work, the more profitable the project becomes for you, while the client gets their finished product sooner.

To transition to project pricing, start by scoping out projects as fixed packages:
- **Analyze the Client's Pain Point**: Understating their commercial goals is the key. Are they looking to capture leads, sell products directly, or showcase credibility to high-net-worth investors?
- **Define a Concrete Scope**: Be extremely explicit about what is included (and what is not). Detail the exact number of pages, custom integrations, and assets.
- **Anchor the Price to Value**: Base your pricing on the commercial return the project will generate. If a website helps a bakery secure just 5 more corporate catering contracts a year worth $2,000 each, a $4,000 design fee is an absolute bargain.

Let's dive deeper into how you actually pitch this value to clients. When a client asks, "What is your hourly rate?" your answer should always redirect the conversation. Instead of saying "$50 an hour," you should say: "I don't charge by the hour because I don't want to penalize efficiency. If I build your site in half the time because of my years of experience, you shouldn't pay less for a faster delivery. Instead, I charge flat project fees so you know exactly what the investment will be from day one, with no surprise invoices." This simple reframing immediately establishes you as a professional rather than a hired hand.

Furthermore, project pricing allows you to build systems. If you develop a library of reusable code, templates, and workflows, you can build a site that used to take 30 hours in just 10 hours. Under project pricing, you make the exact same amount of money in one-third of the time. This is how you escape the hourly trap and start scaling your freelance income like a real business owner.

## 2. Limit Your Revisions
If you do not set a limit, clients will ask for changes forever. Always include a limit in your proposal:
- **Round 1**: Big structural feedback.
- **Round 2**: Text edits and polish.
- **Anything else**: Charged at a flat rate.

Scope creep is the silent killer of freelance businesses. It starts with a simple request: "Can we just change this font?" or "Could we add one more page to show our latest team member?" Without clear boundaries, these minor adjustments cascade into weeks of extra, unpaid labor.

The mistake I made in my first year was trying to make every client happy by offering unlimited edits. I assumed that going above and beyond would lead to referrals and five-star reviews. Instead, it taught clients that my time was free and that they didn't need to make decisions quickly. Projects that should have taken two weeks dragged on for six months, taking up mental bandwidth and preventing me from taking on new, higher-paying contracts.

Establishing a strict "Revision Cap" in your contract changes client behavior instantly. It forces them to consolidate their feedback and be deliberate about their choices. When they know they only have two rounds of feedback, they review the work carefully and present you with a structured, comprehensive list of adjustments, rather than sending twenty disjointed emails at 11pm.

To implement this successfully:
- **Present Revisions as Milestones**: Explicitly define what can be changed in each round. For example, Round 1 is for layouts and structure; changes to the core structure during Round 2 will incur additional fees.
- **Define the Cost of Excess Revisions**: In your proposal, state clearly: "Additional rounds of edits beyond the standard two rounds will be billed at a flat rate of $150 per round or $75/hr."
- **Use Visual Tools**: Share mockups on platforms like Figma or Loom recordings explaining your design choices so clients understand the rationale before they request changes.

Managing revisions is largely about setting expectations during the kickoff meeting. Explain to the client: "To keep us on schedule, our agreement includes two complete rounds of revisions. When I send you the draft, please gather feedback from all stakeholders in your company and send it to me as a single, consolidated list. This ensures we don't get stuck in a feedback loop and can launch your project on time." By showing them that the limit is for their benefit (launching on time), they will respect the boundary and appreciate your project management discipline.

Remember, every round of revision has an administrative cost. You have to open the project files, make the change, upload the new draft, write the email, and wait for approval. A simple "5-minute text change" actually consumes 45 minutes of context-switching time. By capping these rounds, you protect your focus and maintain project momentum, ensuring you can deliver your best work without burnout.

## 3. Factor in Admin and Overhead Time
A project is not just design and development. It is also emails, calls, and project management. Always add a 20% buffer to your estimates to cover this unbilled time. It will keep your business healthy.

When you estimate a project, it is easy to look at the coding or design phase and say, "That will take me about 20 hours of focused work." If you charge based on that 20-hour window, you are ignoring the hidden costs of running a business.

Consider all the tasks that happen around the actual work:
- **Client Communication**: Emails, Slack messages, weekly check-in calls, and alignment meetings.
- **Project Setup**: Configuring hosting, staging environments, domain transfers, and project folders.
- **Client Onboarding**: Invoicing, drafting contracts, chasing payments, and gathering assets (copy, logos, images).
- **Administrative Overhead**: Accounting, taxes, software subscriptions, and hardware maintenance.

In my first year, I spent roughly 15 hours a week on these administrative tasks. Because I wasn't accounting for them in my project pricing, my actual hourly rate was nearly cut in half. I was earning far less than my estimates suggested.

To solve this, you must apply an **Admin Buffer** to every project estimate. If a project requires 20 hours of direct design and development, multiply that figure by 1.25 to account for 5 hours of administrative support. Your quote should reflect this loaded estimate.

Additionally, you must account for the cost of client management tools, development environments, and other business expenses. If you use Slack, Figma, GitHub, accounting software, and a premium hosting platform, these overhead costs should be factored into your base project fees. Many junior freelancers price their work so low that they are actually losing money once software licenses and self-employment taxes are factored in.

Treat your freelance practice like a real company. A web agency doesn't charge you only for the developer's time; they charge for the project manager, the QA tester, the account executive, and the office space. As a solo freelancer, you are playing all of these roles yourself. If you do not charge for the hours spent project managing, onboarding, and supporting the client, you are working those hours for free. Always build that 20-25% admin buffer directly into your flat project proposals.

## 4. The Power of Tiered Options
When presenting a proposal, never give a client a single price. A single price forces a "yes or no" decision. Instead, present three tiers (Bronze, Silver, Gold). This shifts the client's psychological evaluation from "Should I hire this freelancer?" to "Which option fits my budget best?"

A standard tiered structure looks like:
- **The Core Package (Bronze)**: The essential features required to solve their primary problem.
- **The Recommended Package (Silver)**: The core package plus additional value additions (e.g., basic SEO setup, custom animations, speed optimization). This should be priced to be the most attractive.
- **The Premium Package (Gold)**: A premium, white-glove option containing everything plus ongoing support, copywriting, and custom branding. This anchors your pricing high, making the Silver tier look like a highly reasonable middle ground.

Tiered pricing takes advantage of a psychological concept known as price anchoring. When a client sees a Gold package for $8,000, it makes the Silver package at $4,500 look incredibly affordable by comparison. Without that high anchor, a single quote of $4,500 might feel expensive to the client. By offering options, you also capture clients who might have a higher budget than you anticipated. If a client is willing to pay $8,000 for a fully managed, hands-off experience, you would have left $3,500 on the table by only offering a single $4,500 option.

Furthermore, tiered options put the client in control of the scope. If they look at the recommended option and say, "That's a bit out of our budget," you don't have to discount your rate. Instead, you can simply say: "No problem, we can downgrade to the Bronze package which removes the custom animations and basic copywriting." This protects your hourly worth because any reduction in price is accompanied by a corresponding reduction in deliverables.

## 5. Transition to Maintenance Retainers
Project-based freelancing is a rollercoaster. One month you land a $5,000 project, and the next month you are scraping by with zero leads. This "feast or famine" cycle is the most stressful aspect of freelance life.

The key to long-term stability is building recurring revenue through maintenance retainers. After launching a website or completing a contract, offer your client a monthly support package:
- **Security & Backups**: Weekly core updates, security scans, and database backups.
- **Minor Content Updates**: Up to 2 hours of copy changes, image uploads, or layout tweaks per month.
- **SEO Monitoring**: Monthly speed audits and tracking Google Search Console health.

If you charge a modest $200/month for this service, securing just 10 retainer clients yields a steady $2,000/month in baseline recurring income. This covers your basic expenses, giving you the peace of mind to negotiate higher rates for larger, one-off projects.

Retainers are also highly beneficial for the client. Websites are dynamic pieces of software that require regular security patches and updates. If a client's site gets hacked or goes down, it can cost thousands of dollars in emergency development fees to fix. A monthly retainer is essentially an insurance policy for their digital storefront. It guarantees that a professional is keeping their site secure, fast, and up-to-date, allowing them to focus on running their business.

When pitching a retainer, present it as part of the project wrap-up. You can say: "Now that your site is launched, we want to make sure it stays secure and performs optimally. I offer a monthly Care Plan where I handle all software updates, backups, security monitoring, and small content requests. This ensures your website remains a high-performing asset without you having to worry about technical issues. Would you like to add this support plan starting next month?" By framing it as a continuation of your successful partnership, most clients will happily opt in.

## 6. Aligning Price with Value
Ultimately, pricing is not about what you cost; it is about what your work is worth to the client. If your website design helps an e-commerce shop increase their conversion rate by just 1%, resulting in $50,000 in additional sales, your $5,000 fee is trivial.

Always direct the sales conversation away from templates and code, and focus on business growth metrics:
- **Customer Acquisition**: How does this site attract new inquiries?
- **Brand Authority**: How does premium design build trust with high-value prospects?
- **Operational Savings**: Can we automate booking or support to save them hours of manual labor?

By shifting your positioning from a simple technical coder to a strategic business partner, your value increases, allowing you to charge professional fees with absolute confidence.

To do this successfully, you must master the art of the discovery call. Instead of asking, "How many pages do you want?" ask: "What is the primary business goal of this new website? If this project is a massive success twelve months from now, what does that look like for your business?" If the client replies, "We want to double our monthly leads from 20 to 40," you now have a value metric. You are no longer building a "5-page website"; you are building a "lead generation engine that will double their sales pipeline." Pricing a lead generation engine at $6,000 is far easier to justify than pricing a 5-page WordPress site.

In conclusion, fixing your freelance pricing requires a mental shift. You are not selling your hours, your code, or your design skills. You are selling solutions to business problems. Once you start pricing based on the value of those solutions, setting strict boundaries on your revisions, factoring in your admin time, offering tiered options, and building monthly recurring retainers, you will transform your freelance hobby into a highly profitable, sustainable business.`,
    cover: IMG.blog3,
    author: "James Kariuki",
    authorAvatar: IMG.face3,
    date: "May 7, 2026",
    readMins: 10,
    category: "Business",
  },
  {
    slug: "calling-strangers-cold-calls",
    title: "Calling strangers: a freelancer's guide to cold calls that don't suck",
    excerpt:
      "The opening line that works, the question that doesn't, and how to handle the 'send me an email' brush-off.",
    body: `Cold calls are not dead. They're just badly done. A good cold call is one minute long, ends in a question, and never tries to sell anything. Here is the exact cold calling playbook I use to land local projects.\n\n## The 60-Second Script\nYour call should never exceed one minute. Here is the structure:\n- **The Hook**: "Hi, is this the owner? This is Priya. I live down the street." (People trust locals.)\n- **The Notice**: "I was looking at your Google page. I noticed your phone number link does not dial when tapped on mobile."\n- **The Offer**: "I can fix that for you in ten minutes. No charge. I just wanted to help out."\n- **The Close**: "Is it okay if I email you the details?"\n\n## Handle the Brush-off\nIf they say "send me an email", say: "Sure! What is the best address? I will send a quick screenshot of the issue." Do not push. Keep it warm and helpful.`,
    cover: IMG.blog4,
    author: "Priya Patel",
    authorAvatar: IMG.face4,
    date: "April 30, 2026",
    readMins: 7,
    category: "Outreach",
  },
  {
    slug: "freelance-from-anywhere",
    title: "Freelancing from anywhere: clients I won from a beach in Goa",
    excerpt:
      "A week-by-week breakdown of how location stopped mattering for my consulting practice.",
    body: `Two years ago, I packed my bags and moved my freelance business from London to Goa. I assumed my income would take a hit. Instead, it tripled. I realized that clients do not care where you sit, as long as you deliver results.\n\nBut working remotely takes system and discipline. Here is how I manage it.\n\n## Clear Communication is King\nWhen you do not see clients in person, you must over-communicate:\n- **Weekly updates**: Send a simple email every Friday listing what you did.\n- **Video walkthroughs**: Send 2-minute Loom videos instead of long emails.\n- **Async tools**: Use tools like Slack or Trello to keep everything visible.\n\n## Manage the Timezones\nIf you work from a beach, align your hours with your clients. I work late afternoons and evenings in Goa so I can match my UK clients' mornings. It gives me free mornings to swim and surf, and my clients never feel the distance.`,
    cover: IMG.blog5,
    author: "Alex Johnson",
    authorAvatar: IMG.face5,
    date: "April 23, 2026",
    readMins: 8,
    category: "Lifestyle",
  },
  {
    slug: "templates-vs-personal-outreach",
    title: "Templates vs personal outreach: the unsexy truth",
    excerpt: "When templates work, when they backfire, and the 80/20 rule that saved my Mondays.",
    body: `Templates aren't shortcuts — they're scaffolding. The first three sentences are templated. The fourth is yours. I follow a simple 80/20 rule to keep my outreach fast but deeply personal.\n\n## The 80/20 Rule\n- **The 80% (Templated)**: Your introduction, your credentials, and your call-to-action. These do not need to change.\n- **The 20% (Personalized)**: The specific problem you found on their website, and the quick tip you suggest. This must be written from scratch for every business.\n\n## Make it Feel Personal\nNever send an email that could apply to any business. If your template says "I can improve your digital presence", it is too vague. Say: "I noticed your menu page is a PDF that takes 8 seconds to load." That is specific. It proves you actually looked at their business.`,
    cover: IMG.blog6,
    author: "Sofia Romano",
    authorAvatar: IMG.face6,
    date: "April 16, 2026",
    readMins: 5,
    category: "Outreach",
  },
];

export const CHANGELOG: {
  date: string;
  version: string;
  title: string;
  items: string[];
  tag: "feature" | "improvement" | "fix";
}[] = [
  {
    date: "May 28, 2026",
    version: "v2.4.0",
    title: "AI Outreach Writer is live for Pro",
    tag: "feature",
    items: [
      "Personalised email + DM generator, fed from each lead's profile",
      "Tone slider: friendly, formal, casual, direct",
      "5 languages: English, Spanish, French, Italian, Portuguese",
    ],
  },
  {
    date: "May 14, 2026",
    version: "v2.3.2",
    title: "Faster discovery in dense cities",
    tag: "improvement",
    items: [
      "Discover queries in Lagos, Mumbai and São Paulo are 3× faster",
      "Lead cards now lazy-load — pages with 100+ leads stay snappy",
    ],
  },
  {
    date: "May 02, 2026",
    version: "v2.3.0",
    title: "Pipeline kanban with drag-and-drop",
    tag: "feature",
    items: [
      "Move leads between stages by dragging",
      "Per-stage filters and weekly follow-up view",
      "CSV export of your full pipeline",
    ],
  },
  {
    date: "Apr 19, 2026",
    version: "v2.2.4",
    title: "Fix: WhatsApp links not opening on iOS 17",
    tag: "fix",
    items: ["Outreach links to WhatsApp now use the universal wa.me handler"],
  },
  {
    date: "Apr 04, 2026",
    version: "v2.2.0",
    title: "9 new freelancer categories",
    tag: "feature",
    items: [
      "Added VAs, photographers, video editors, marketers and 5 more",
      "Each category gets its own opportunity-scoring model",
    ],
  },
];

export const TEAM = [
  {
    name: "Trendtactics Digital",
    role: "Digital Sourcing Agency & Strategic Partner",
    city: "Lagos, Nigeria",
    avatar: IMG.face1,
    bio: "Founding partner. Engineering high-performing digital ecosystems, verified datasets, and client acquisition channels for freelancers.",
  },
  {
    name: "Gravity",
    role: "Lead AI Architect",
    city: "DeepMind",
    avatar: IMG.face7,
    bio: "AI pair programming engineer. Writing code, verifying database schemas, scoring opportunity signals, and optimizing workflows in a minute.",
  },
  {
    name: "Love",
    role: "Community Growth & Trust Operations",
    city: "Lagos, Nigeria",
    avatar: IMG.face6,
    bio: "Managing safety guidelines, community support, and helping freelancers globally connect with high-paying client contracts.",
  },
];

export const FREELANCER_CATEGORIES: {
  slug: string;
  label: string;
  emoji: string;
  image: string;
  tagline: string;
  description: string;
  problems: string[];
  sampleBusinesses: { name: string; reason: string }[];
}[] = [
  {
    slug: "web-developers",
    label: "Web Developers",
    emoji: "",
    image: IMG.webDev,
    tagline: "Find local businesses still running on a Facebook page.",
    description:
      "Every week, LanceConnect surfaces hundreds of restaurants, salons, plumbers and clinics in your area that have no website — or a broken one from 2014. Reach them before someone else does.",
    problems: [
      "No website at all",
      "Outdated WordPress with broken links",
      "No mobile-friendly version",
      "No online booking form",
    ],
    sampleBusinesses: [
      { name: "Boulangerie Dupont, Lyon", reason: "4.9★ on Google, no website" },
      { name: "Mario's Ristorante, Naples", reason: "Facebook-only presence" },
      { name: "Lagos Hair Studio", reason: "Website returns 502" },
    ],
  },
  {
    slug: "designers",
    label: "Graphic Designers",
    emoji: "",
    image: IMG.designer,
    tagline: "Spot brands that desperately need a refresh.",
    description:
      "Logos from 2008. Menus printed in Comic Sans. Inconsistent colours across every channel. These businesses don't know they need you — until you show them.",
    problems: [
      "Dated or pixelated logo",
      "No brand consistency online",
      "Ugly menus and price lists",
      "No social media graphics",
    ],
    sampleBusinesses: [
      { name: "Smith & Sons Plumbing, Manchester", reason: "Logo is clip-art" },
      { name: "Café Mirador, Buenos Aires", reason: "Different colours on each platform" },
      { name: "AutoFix Garage, Toronto", reason: "No brand kit" },
    ],
  },
  {
    slug: "copywriters",
    label: "Copywriters",
    emoji: "",
    image: IMG.copywriter,
    tagline: "Find websites whose copy is putting customers to sleep.",
    description:
      "Generic 'About Us' pages. Headlines that say 'Welcome to our site'. Product descriptions written by the founder at 11pm. The web is full of businesses that need a copywriter — they just don't know it.",
    problems: [
      "Generic homepage hero copy",
      "No clear value proposition",
      "Empty or thin blog",
      "Vague service descriptions",
    ],
    sampleBusinesses: [
      { name: "Dr. Patel Dental Clinic, Mumbai", reason: "Homepage says 'Welcome to our website'" },
      { name: "AutoFix Garage, Toronto", reason: "No services described" },
    ],
  },
  {
    slug: "seo-specialists",
    label: "SEO Specialists",
    emoji: "",
    image: IMG.seo,
    tagline: "Find businesses invisible on Google.",
    description:
      "If a restaurant doesn't appear in 'best pizza near me' results in their own city, you have a client. We'll show you which ones.",
    problems: [
      "No Google Business Profile",
      "Not indexed for their main keyword",
      "No backlinks",
      "Slow page speed",
    ],
    sampleBusinesses: [
      { name: "Boulangerie Dupont, Lyon", reason: "Not ranking for 'bakery Lyon'" },
      { name: "Kuala Lumpur Yoga Studio", reason: "No GMB profile" },
    ],
  },
  {
    slug: "social-media",
    label: "Social Media Managers",
    emoji: "",
    image: IMG.social,
    tagline: "Spot brands whose Instagram hasn't posted since 2022.",
    description:
      "Restaurants, gyms, boutiques — they all know they 'should' be posting. They just don't have time. That's your opening.",
    problems: [
      "Last post 6+ months ago",
      "No Reels or short-form video",
      "Inconsistent branding across platforms",
      "No paid social presence",
    ],
    sampleBusinesses: [
      { name: "Mario's Ristorante, Naples", reason: "Last post: 2022" },
      { name: "Café Mirador, Buenos Aires", reason: "Only 47 followers" },
    ],
  },
  {
    slug: "videographers",
    label: "Videographers",
    emoji: "",
    image: IMG.video,
    tagline: "Find businesses whose YouTube is a wasteland.",
    description:
      "Hotels with zero room-tour videos. Restaurants with no behind-the-scenes content. Schools with no campus tours. These need video — and they have budgets.",
    problems: [
      "No video content at all",
      "Only one shaky phone video",
      "No Reels or TikTok presence",
      "Outdated promo from 2019",
    ],
    sampleBusinesses: [
      { name: "Kuala Lumpur Yoga Studio", reason: "No class previews" },
      { name: "Dr. Patel Dental Clinic", reason: "No clinic tour" },
    ],
  },
  {
    slug: "photographers",
    label: "Photographers",
    emoji: "",
    image: IMG.photo,
    tagline: "Find restaurants using stock photos of pasta.",
    description:
      "Hotels with blurry lobby shots. Restaurants with dimly-lit menu photos. Salons with no portfolio. Your camera is the answer.",
    problems: [
      "Stock photos instead of real shots",
      "Blurry phone photos on Google",
      "No portfolio of their actual work",
      "No team headshots",
    ],
    sampleBusinesses: [
      { name: "Boulangerie Dupont, Lyon", reason: "Generic croissant stock photo" },
      { name: "Lagos Hair Studio", reason: "No before/after gallery" },
    ],
  },
  {
    slug: "marketers",
    label: "Digital Marketers",
    emoji: "",
    image: IMG.marketing,
    tagline: "Spot businesses spending zero on ads — and growing flat.",
    description:
      "If they're not on Meta Ads, Google Ads, or running email campaigns, you can probably double their reach in 90 days.",
    problems: [
      "No paid advertising at all",
      "No email list",
      "No remarketing pixels",
      "No analytics installed",
    ],
    sampleBusinesses: [
      { name: "Smith & Sons Plumbing", reason: "No tracking pixels" },
      { name: "AutoFix Garage, Toronto", reason: "No email signup" },
    ],
  },
  {
    slug: "virtual-assistants",
    label: "Virtual Assistants",
    emoji: "",
    image: IMG.va,
    tagline: "Find solo founders drowning in admin.",
    description:
      "Coaches, consultants, agency owners — they all do too much themselves. We surface the busy ones who're showing the signs.",
    problems: [
      "Founder still doing all email",
      "No CRM or inbox management",
      "Manual invoicing",
      "Booking calls done over DMs",
    ],
    sampleBusinesses: [
      { name: "Dr. Patel Dental Clinic", reason: "Owner replies to every DM personally" },
      { name: "Café Mirador", reason: "Owner doing all bookings via WhatsApp" },
    ],
  },
  {
    slug: "app-developers",
    label: "App Developers",
    emoji: "",
    image: IMG.appDev,
    tagline: "Spot businesses that need a mobile app — not just a website.",
    description:
      "Loyalty programs, booking apps, delivery apps. There's a huge middle market of established businesses with no app at all.",
    problems: [
      "No loyalty app for repeat customers",
      "Booking done via phone only",
      "No mobile ordering",
      "No staff scheduling app",
    ],
    sampleBusinesses: [
      { name: "Kuala Lumpur Yoga Studio", reason: "Bookings via WhatsApp" },
      { name: "AutoFix Garage, Toronto", reason: "Paper service records" },
    ],
  },
  {
    slug: "online-tutors",
    label: "Online Tutors",
    emoji: "🎓",
    image: IMG.coffeeShop,
    tagline: "Find schools, academies, and families looking for remote tutors.",
    description:
      "From language instructors to math coaches, remote education is booming. We scan language schools, local academies, and tutoring platforms needing subject matter experts.",
    problems: [
      "High student-to-teacher ratio",
      "No native language tutors listed",
      "Outdated learning materials online",
      "No online class booking portal",
    ],
    sampleBusinesses: [
      { name: "London Language Academy", reason: "Looking for Igbo/Yoruba instructors" },
      { name: "Peckham Tutoring Center", reason: "Math tutor positions vacant" },
    ],
  },
  {
    slug: "african-food-export",
    label: "African Food Exporters",
    emoji: "🌍",
    image: IMG.marketStall,
    tagline: "Find international buyers, supermarkets, and ethnic wholesalers.",
    description:
      "Looking to export palm oil, garri, ogbono, or cocoa? We identify supermarkets, restaurants, and wholesalers in the UK, US, and EU carrying ethnic food products.",
    problems: [
      "No direct African import contacts",
      "Looking for palm oil/garri suppliers",
      "Struggling to find reliable importers",
      "Relying on expensive intermediaries",
    ],
    sampleBusinesses: [
      { name: "Wanis International Foods, UK", reason: "Major ethnic food distributor" },
      { name: "Peckham Quality Foods, London", reason: "High retail demand for African food" },
    ],
  },
  {
    slug: "restaurant-suppliers",
    label: "Restaurant Suppliers",
    emoji: "🍽️",
    image: IMG.coffeeShop,
    tagline: "Connect with local restaurants, hotels, and cafes needing fresh supply.",
    description:
      "Get your ingredients, fresh produce, or cooked meals into local kitchens. We surface hospitality businesses, restaurants, and catering services in any city.",
    problems: [
      "High ingredient procurement costs",
      "Looking for local food suppliers",
      "Frequent supply stockouts",
      "No organic or specialized menu partners",
    ],
    sampleBusinesses: [
      { name: "Mario's Ristorante, Naples", reason: "Needs direct tomato/oil supplier" },
      { name: "Lagos Catering Services", reason: "High-volume weekly orders" },
    ],
  },
  {
    slug: "product-export",
    label: "Product Importers & Exporters",
    emoji: "🛒",
    image: IMG.marketStall,
    tagline: "Find global wholesalers and international buyers for your products.",
    description:
      "Expand your trade borders. We map commodity traders, import-export agencies, and wholesalers seeking new consumer goods, agricultural products, or manufactured items.",
    problems: [
      "High customs brokerage friction",
      "Struggling to find overseas distributors",
      "No verified international buyer leads",
      "Inefficient agent networks",
    ],
    sampleBusinesses: [
      { name: "Global Trade Importers, NY", reason: "Active buyer of organic goods" },
      { name: "Euro Foods Wholesaler", reason: "Expansive distribution network" },
    ],
  },
  {
    slug: "b2b-trade",
    label: "B2B Trade Partners",
    emoji: "🏭",
    image: IMG.workspace,
    tagline: "Find manufacturers and procurement agencies looking for your products.",
    description:
      "For raw materials, manufacturing inputs, or wholesale supplies. We surface factories, industrial distributors, and procurement companies seeking new supply channels.",
    problems: [
      "High material sourcing costs",
      "Supply chain bottleneck constraints",
      "Relying on single-source suppliers",
      "No backup procurement channels",
    ],
    sampleBusinesses: [
      { name: "Sheffield Manufacturing, UK", reason: "Looking for metal/polymer parts" },
      { name: "Lagos Industrial Packagers", reason: "Needs bulk paper/carton inputs" },
    ],
  },
  {
    slug: "corporate-training",
    label: "Corporate Training & L&D",
    emoji: "📚",
    image: IMG.team,
    tagline: "Find corporate offices and HR teams needing leadership and L&D solutions.",
    description:
      "Pitch your leadership workshops, technical training, or AI courses. We identify corporate offices, business headquarters, and HR departments looking to upskill their workforce.",
    problems: [
      "Skills gaps in AI or leadership",
      "No structured workforce L&D plan",
      "High employee turnover rates",
      "Manual/outdated staff training tools",
    ],
    sampleBusinesses: [
      {
        name: "Acme Corporate HQ, London",
        reason: "HR department actively hiring external trainers",
      },
      { name: "Lagos Financial Training Center", reason: "High employee training budget" },
    ],
  },
];
