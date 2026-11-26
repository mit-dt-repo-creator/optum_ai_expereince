/**
 * Editable sample content.
 *
 * Category copy is illustrative marketing text, not a verified statement of
 * what any GECX agent can do. Every persona, identifier, date and number below
 * is fictional and exists only to set the scene for a demo. Persona data is
 * presentation-only: it is never sent to, or known by, the launched agent.
 *
 * Prompts are sample "Try asking" suggestions shown after launching the voice
 * agent. They are not a statement of what the agent can answer.
 *
 * Simulation: when no GECX link is configured, Call and Chat open a clearly
 * labelled simulated demo. `greeting` ({name} = persona first name) opens the
 * conversation, and `answers[i]` is the scripted reply to `prompts[i]`.
 *
 * Portraits: set a persona's photo to a licensed image in public/personas/,
 * e.g. photo: '/personas/jordan-ellis.jpg'. Leave it null to show initials.
 */
export const categories = [
  {
    id: 'payer',
    agentName: 'Payer AI Agent',
    label: 'Payer',
    title: 'Payer',
    description:
      'Explore AI-powered experiences for member services, benefits, claims, and prior authorization.',
    icon: 'payer',
    greeting: "Hi {name}, thanks for contacting your health plan's AI agent. How can I help you today?",
    profileHeading: 'Fictional member profile',
    personas: [
      {
        id: 'payer-1',
        name: 'Jordan Ellis',
        demoId: 'DEMO-MBR-1042',
        photo: null,
        about: 'A member asking why a recent imaging claim was denied and when a pending prior authorization will be decided.',
        prompts: [
          "Why was my claim from Lakeside Imaging Center denied?",
          "What's the status of my prior authorization?",
          "How do I appeal a denied claim?",
        ],
        answers: [
          "Your claim DEMO-CLM-2207 from Lakeside Imaging Center was denied because the MRI was done before the prior authorization was approved. Once the authorization is approved, the claim can be reprocessed. Would you like me to flag it for review?",
          "Your prior authorization request is with our clinical review team. Decisions usually take up to 5 business days, and I can text you as soon as it is decided.",
          "You can appeal within 180 days of the denial. I can start the appeal now and send you a checklist of what to include, such as a letter of medical necessity from your doctor.",
        ],
        details: [
          { label: 'DOB', value: 'March 4, 1981' },
          { label: 'Last 4 SSN', value: '0000' },
          { label: 'Provider name', value: 'Lakeside Imaging Center' },
          { label: 'Claim info', value: 'DEMO-CLM-2207' },
        ],
      },
      {
        id: 'payer-2',
        name: 'Priya Raman',
        demoId: 'DEMO-MBR-2318',
        photo: null,
        about: 'A new member checking in-network options and referral rules before booking a specialist visit.',
        prompts: [
          "Do I need a referral to see a dermatologist?",
          "Is there an in-network dermatologist near me?",
          "What will a specialist visit cost on my plan?",
        ],
        answers: [
          "Yes. On your HMO plan you'll need a referral from your primary care provider before seeing a dermatologist. I can send a referral request to your doctor's office today.",
          "I found three in-network dermatologists within 10 miles. The closest is Riverside Dermatology, about 2 miles away, with openings next week.",
          "With a referral, an in-network specialist visit has a $40 copay on your plan. Without a referral, the visit may not be covered.",
        ],
        details: [
          { label: 'DOB', value: 'July 22, 1993' },
          { label: 'Plan type', value: 'HMO (sample)' },
          { label: 'Specialty', value: 'Dermatology' },
          { label: 'Question', value: 'Referral requirements' },
        ],
      },
      {
        id: 'payer-3',
        name: 'Marcus Webb',
        demoId: 'DEMO-MBR-3375',
        photo: null,
        about: 'A Medicare Advantage member asking how a newly prescribed medication is covered.',
        prompts: [
          "Is my new prescription covered by my plan?",
          "Is my prescription ready to pick up at Main Street Pharmacy?",
          "Can I get a 90-day supply by mail?",
        ],
        answers: [
          "Yes. Your new prescription is on your plan's drug list at Tier 2, so your copay is $10 for a 30-day supply.",
          "Main Street Pharmacy shows prescription DEMO-RX-5531 as ready for pickup. They will hold it for 7 days.",
          "Yes. You can get a 90-day supply through home delivery for $20, which saves you about $10 every three months. Would you like me to set that up?",
        ],
        details: [
          { label: 'DOB', value: 'November 9, 1954' },
          { label: 'Plan type', value: 'Medicare Advantage (sample)' },
          { label: 'Pharmacy', value: 'Main Street Pharmacy' },
          { label: 'Rx reference', value: 'DEMO-RX-5531' },
        ],
      },
    ],
  },
  {
    id: 'provider',
    agentName: 'Provider AI Agent',
    label: 'Provider',
    title: 'Provider',
    description:
      'Explore AI-powered experiences for patient access, appointment support, and administrative workflows.',
    icon: 'provider',
    greeting: "Hello {name}, you've reached the clinic's AI support agent. What can I help you with?",
    profileHeading: 'Fictional patient-access scenario',
    personas: [
      {
        id: 'provider-1',
        name: 'Alex Moreno',
        demoId: 'DEMO-PT-5501',
        photo: null,
        about: 'A new patient trying to book a first primary-care visit at a convenient time.',
        prompts: [
          "I'd like to book my first primary care appointment.",
          "Do you have any weekday morning openings?",
          "What should I bring to my first visit?",
        ],
        answers: [
          "I'd be happy to help. Dr. Patel has a new-patient wellness visit open next Tuesday at 9:00 AM. Would you like me to book it?",
          "Yes. There are weekday morning openings on Tuesday at 9:00, Wednesday at 8:30 and Friday at 10:15. Which works best for you?",
          "Please bring a photo ID, your insurance card, a list of your current medications and any recent records. Plan to arrive 15 minutes early for check-in.",
        ],
        details: [
          { label: 'Visit type', value: 'Annual wellness' },
          { label: 'Department', value: 'Primary care' },
          { label: 'Preferred time', value: 'Weekday mornings' },
          { label: 'Insurance', value: 'On file (sample)' },
        ],
      },
      {
        id: 'provider-2',
        name: 'Dana Whitfield',
        demoId: 'DEMO-OFC-6120',
        photo: null,
        about: "An orthopedic office manager verifying a patient's eligibility ahead of a scheduled procedure.",
        prompts: [
          "Can you check a patient's eligibility for knee arthroscopy?",
          "Does this procedure need prior authorization?",
          "What information do you need from our office?",
        ],
        answers: [
          "Sure. For this demo I'll use a sample patient: coverage is active, and outpatient surgery is covered after the deductible.",
          "Yes, knee arthroscopy needs prior authorization on this plan. Standard reviews take up to 5 business days, so submitting today keeps you on track for Tuesday.",
          "I'll need the procedure and diagnosis codes, the ordering physician's notes, recent imaging results and the planned date of service.",
        ],
        details: [
          { label: 'Role', value: 'Office manager' },
          { label: 'Practice', value: 'Orthopedics clinic' },
          { label: 'Procedure', value: 'Knee arthroscopy' },
          { label: 'Needed by', value: 'Next Tuesday' },
        ],
      },
      {
        id: 'provider-3',
        name: 'Samuel Okafor',
        demoId: 'DEMO-PT-6794',
        photo: null,
        about: 'A returning cardiology patient who needs to move an upcoming follow-up appointment.',
        prompts: [
          "I need to reschedule my cardiology follow-up.",
          "What's the next available slot after Thursday?",
          "Can I switch to a video visit?",
        ],
        answers: [
          "No problem. I see your cardiology follow-up on Thursday at 2:30 PM. Would you like the next available time instead?",
          "The next openings with your cardiologist are Monday at 11:00 AM and Tuesday at 3:15 PM. Shall I move your visit to one of those?",
          "Yes, this follow-up can be a video visit. I'll send you a link and setup instructions by text and email.",
        ],
        details: [
          { label: 'Department', value: 'Cardiology' },
          { label: 'Visit type', value: 'Follow-up' },
          { label: 'Current slot', value: 'Thursday, 2:30 PM' },
          { label: 'Preferred channel', value: 'Chat' },
        ],
      },
    ],
  },
  {
    id: 'lifeSciences',
    agentName: 'Life Sciences AI Agent',
    label: 'Life Sciences',
    title: 'Life Sciences',
    description:
      'Explore AI-powered experiences for product information, patient support, and program navigation.',
    icon: 'lifeSciences',
    greeting: "Hi {name}, welcome to the patient support AI agent. How can I help today?",
    profileHeading: 'Fictional support inquiry',
    personas: [
      {
        id: 'ls-1',
        name: 'Taylor Brooks',
        demoId: 'DEMO-PSP-7203',
        photo: null,
        about: 'A newly enrolled patient asking what happens next in a patient support program.',
        prompts: [
          "What happens next now that I'm enrolled?",
          "How do I get help paying for my medication?",
          "Can someone remind me about refills?",
        ],
        answers: [
          "Welcome to the program! A care coordinator will call you within 2 business days to review your benefits, set up medication delivery and answer any questions.",
          "You may qualify for copay assistance that lowers your out-of-pocket cost. I can check your eligibility now. It takes about two minutes.",
          "Yes. I can set up refill reminders by text or phone call, 5 days before you're due. Which would you prefer?",
        ],
        details: [
          { label: 'Inquirer', value: 'Patient' },
          { label: 'Program', value: 'Support program (sample)' },
          { label: 'Enrollment', value: 'Newly enrolled' },
          { label: 'Preferred channel', value: 'Voice' },
        ],
      },
      {
        id: 'ls-2',
        name: 'Dr. Nina Castillo',
        demoId: 'DEMO-HCP-7841',
        photo: null,
        about: 'A rheumatologist requesting product information to prepare for a patient consultation.',
        prompts: [
          "Can you send me the prescribing information?",
          "What are the dosing guidelines?",
          "How do I request a visit from a medical science liaison?",
        ],
        answers: [
          "Of course. I can email you the full prescribing information and the patient medication guide right away.",
          "Dosing guidance is in section 2 of the prescribing information. For product-specific questions, I can also connect you with a medical information specialist.",
          "I can request a visit from a medical science liaison. Share your preferred dates and a liaison will confirm within 2 business days.",
        ],
        details: [
          { label: 'Inquirer', value: 'Healthcare professional' },
          { label: 'Specialty', value: 'Rheumatology' },
          { label: 'Request type', value: 'Product information' },
          { label: 'Setting', value: 'Outpatient clinic' },
        ],
      },
      {
        id: 'ls-3',
        name: 'Chris Lindqvist',
        demoId: 'DEMO-CG-8456',
        photo: null,
        about: 'A caregiver navigating an access-program renewal on behalf of a family member.',
        prompts: [
          "How do I renew my family member's program enrollment?",
          "What documents do I need for renewal?",
          "What happens if we miss the deadline?",
        ],
        answers: [
          "I can help with that. The renewal takes about 10 minutes, and as a registered caregiver you can complete it on your family member's behalf.",
          "You'll need proof of current insurance, recent income information and the prescriber's signature on the renewal form.",
          "If the deadline passes, benefits pause until the renewal is approved. To avoid a gap, submit it at least a week before the end of the month.",
        ],
        details: [
          { label: 'Inquirer', value: 'Caregiver' },
          { label: 'Program', value: 'Access support (sample)' },
          { label: 'Enrollment', value: 'Renewal due' },
          { label: 'Deadline', value: 'End of month' },
        ],
      },
    ],
  },
];
