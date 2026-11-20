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
