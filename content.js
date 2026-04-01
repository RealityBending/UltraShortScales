// content.js

var questionnaireCompendium = [
    {
        domain: "Clinical, Health, and Well-being",
        categories: [
            {
                category: "Symptoms, Screening, and Health",
                groups: [
                    {
                        group: "Clinical symptom screening",
                        measures: [
                            {
                                name: "PHQ-4",
                                total_items: 4,
                                instructions: "Over the last 2 weeks, how often have you been bothered by the following problems?",
                                scale: "4-point Likert (0 = Not at all to 3 = Nearly every day)",
                                references: ["Kroenke et al. (2009)", "Löwe et al. (2010)"],
                                notes: "Widely used ultra-brief screener combining PHQ-2 and GAD-2.",
                                dimensions: [
                                    {
                                        name: "Depression (PHQ-2)",
                                        items: ["Little interest or pleasure in doing things", "Feeling down, depressed, or hopeless"],
                                    },
                                    {
                                        name: "Anxiety (GAD-2)",
                                        items: ["Feeling nervous, anxious or on edge", "Not being able to stop or control worrying"],
                                    },
                                ],
                            },
                            {
                                name: "Cambridge Depersonalization Scale - 2-item adaptation",
                                short_name: "CSD-2",
                                total_items: 2,
                                instructions: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
                                scale: "4-points Likert. Not at all = 0/Several days = 1/More than half the days = 2/Nearly every day = 3.",
                                references: ["Michal et al. (2011)"],
                                notes: "Cambridge Depersonalization Scale (2-item version).",
                                dimensions: [
                                    {
                                        name: "Depersonalization",
                                        items: [
                                            "My surroundings feel detached or unreal, as if there was a veil between me and the outside world.",
                                            "Out of the blue, I feel strange, as if I were not real or as if I were cut off from the world.",
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Bubbles-DASS",
                                total_items: 3,
                                instructions: "Please rate how much the following states applied to you over the past week:",
                                scale: "4-point Likert",
                                references: ["Brailovskaia et al. (2024)"],
                                notes: "One-item screens for depression, anxiety, and stress based on the DASS-21 subscales.",
                                dimensions: [
                                    { name: "Depression", items: ["Depression"] },
                                    { name: "Anxiety", items: ["Anxiety"] },
                                    { name: "Stress", items: ["Stress"] },
                                ],
                            },
                            {
                                name: "PTSD-PCL-2",
                                total_items: 2,
                                instructions: "In the past month, how much were you bothered by:",
                                scale: "5-point Likert (1 = Not at all to 5 = Extremely)",
                                references: ["Lang et al. (2012)"],
                                notes: "A 2-item ultra-short Posttraumatic Stress Disorder Checklist (PCL-2). Maintains high sensitivity.",
                                dimensions: [
                                    {
                                        name: "Posttraumatic Stress",
                                        items: [
                                            "Are you bothered by repeated, disturbing memories in the past month?",
                                            "Are you bothered by feeling upset when reminded of past stress?",
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        group: "Health, stress, and sleep",
                        measures: [
                            {
                                name: "Single-Item Sleep Quality Scale",
                                short_name: "SQS",
                                total_items: 1,
                                instructions: "Please consider your sleep over the past 7 days.",
                                scale: "11-point scale (0 = Terrible to 10 = Excellent)",
                                references: ["Snyder et al. (2018)"],
                                notes: "Possesses excellent concurrent criterion validity and tracks well with longer scales like the PSQI.",
                                dimensions: [
                                    {
                                        name: "Sleep Quality",
                                        items: ["During the past 7 days, how would you rate your sleep quality overall?"],
                                    },
                                ],
                            },
                            {
                                name: "Single-Item Measure of Stress Symptoms",
                                short_name: "SIMS",
                                total_items: 1,
                                instructions: "Please read the following definition of stress and answer the question.",
                                scale: "5-point Likert (1 = Not at all to 5 = Very much)",
                                references: ["Elo et al. (2003)"],
                                notes: "Widely used in occupational health and population studies.",
                                dimensions: [
                                    {
                                        name: "Stress Symptoms",
                                        items: [
                                            "Stress means a situation in which a person feels tense, restless, nervous or anxious or is unable to sleep at night because his/her mind is troubled all the time. Do you feel this kind of stress these days?",
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Self-Rated Health",
                                short_name: "SRH",
                                total_items: 1,
                                instructions: "Please rate your overall health.",
                                scale: "5-point ordinal (Excellent, Very good, Good, Fair, Poor)",
                                references: ["DeSalvo et al. (2006)", "Idler & Benyamini (1997)"],
                                notes: "Perhaps the most thoroughly validated single item in epidemiology and psychology.",
                                dimensions: [
                                    {
                                        name: "Self-Rated Health",
                                        items: ["In general, would you say your health is: Excellent, Very good, Good, Fair, or Poor?"],
                                    },
                                ],
                            },
                            {
                                name: "Perceived Health Competence Scale - Short Form",
                                short_name: "PHCS-2",
                                total_items: 2,
                                instructions: "Indicate how much you agree with the following statements.",
                                scale: "5-point Likert (1 = Strongly Disagree to 5 = Strongly Agree)",
                                references: ["Smith et al. (1995)", "Ehlers et al. (2025)"],
                                notes: "Assesses domain-specific self-efficacy focused on health management.",
                                dimensions: [
                                    {
                                        name: "Health Competence",
                                        items: [
                                            "It is difficult for me to find effective solutions to the health problems that come my way. (Reverse-scored)",
                                            "I am able to do things for my health as well as most other people.",
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        group: "Body awareness and interoception",
                        measures: [
                            {
                                name: "Body Perception Questionnaire – Very Short Form",
                                short_name: "BQP-VSF",
                                total_items: 12,
                                instructions: "Imagine how your body feels in general. How often do you feel...",
                                scale: "5-point Likert (1 = Never to 5 = Always)",
                                references: ["Brand et al. (2024)"],
                                notes: "Borderline ultra-short; included for completeness.",
                                dimensions: [],
                            },
                            {
                                name: "Perth Alexithymia Questionnaire – Short Form",
                                short_name: "PAQ-S",
                                total_items: 6,
                                instructions: "Please rate the extent to which you agree with the following statements.",
                                scale: "7-point Likert",
                                references: ["Preece et al. (2023)"],
                                notes: "",
                                dimensions: [],
                            },
                        ],
                    },
                ],
            },
            {
                category: "Self-Regulation and Coping",
                groups: [
                    {
                        group: "Emotion reactivity and emotion regulation",
                        measures: [
                            {
                                name: "Brief Emotion Reactivity Scale",
                                short_name: "B-ERS",
                                total_items: 6,
                                instructions: "Read each statement and indicate how characteristic it is of you.",
                                scale: "5-point Likert",
                                references: ["Veilleux et al. (2024)"],
                                dimensions: [],
                            },
                            {
                                name: "Difficulties in Emotion Regulation Scale – Super Short Form",
                                short_name: "DERS-SSF",
                                total_items: 6,
                                instructions: "Please indicate how often the following statements apply to you.",
                                scale: "5-point Likert (1 = Almost never to 5 = Almost always)",
                                references: ["Kaufman et al. (2016)", "Dan-Glauser & Quartier"],
                                dimensions: [
                                    { name: "Non-Acceptance", items: ["When I'm upset, I become angry with myself for feeling that way."] },
                                    { name: "Impulse", items: ["When I'm upset, I become out of control."] },
                                    { name: "Goals", items: ["When I'm upset, I have difficulty getting work done."] },
                                    { name: "Awareness", items: ["I pay attention to how I feel. (Reverse)"] },
                                    {
                                        name: "Strategies",
                                        items: ["When I'm upset, I believe that there is nothing I can do to make myself feel better."],
                                    },
                                    { name: "Clarity", items: ["I have difficulty making sense out of my feelings."] },
                                ],
                            },
                            {
                                name: "Emotion Regulation Questionnaire – Short Form",
                                short_name: "ERQ-S",
                                total_items: 6,
                                instructions:
                                    "We would like to ask you questions about your emotional life, in particular, how you control your emotions.",
                                scale: "7-point Likert",
                                references: ["Valenti & Faraci (2025)"],
                                dimensions: [],
                            },
                            {
                                name: "Cognitive Emotion Regulation Questionnaire – Short Form",
                                short_name: "CERQ-Short",
                                total_items: 18,
                                instructions: "How do you generally think when you experience negative or unpleasant events?",
                                scale: "5-point Likert",
                                references: ["Garnefski & Kraaij (2006)", "Saetren et al. (2024)"],
                                dimensions: [],
                            },
                        ],
                    },
                    {
                        group: "Coping, defences, and psychological flexibility",
                        measures: [
                            {
                                name: "Brief COPE",
                                total_items: 28,
                                instructions:
                                    "These items deal with ways you've been coping with the stress in your life. Make your answers as true FOR YOU as you can.",
                                scale: "4-point Likert (1 = I haven't been doing this at all to 4 = I've been doing this a lot)",
                                references: ["Carver (1997)"],
                                notes: "Contains 28 items measuring 14 distinct coping dimensions. 2 items per dimension.",
                                dimensions: [
                                    {
                                        name: "Self-distraction",
                                        items: [
                                            "I've been turning to work or other activities to take my mind off things.",
                                            "I've been doing something to think about it less, such as going to movies, watching TV, reading, daydreaming, sleeping, or shopping.",
                                        ],
                                    },
                                    {
                                        name: "Active coping",
                                        items: [
                                            "I've been concentrating my efforts on doing something about the situation I'm in.",
                                            "I've been taking action to try to make the situation better.",
                                        ],
                                    },
                                    {
                                        name: "Denial",
                                        items: [
                                            "I've been saying to myself 'this isn't real.'",
                                            "I've been refusing to believe that it has happened.",
                                        ],
                                    },
                                    {
                                        name: "Substance use",
                                        items: [
                                            "I've been using alcohol or other drugs to make myself feel better.",
                                            "I've been using alcohol or other drugs to help me get through it.",
                                        ],
                                    },
                                    {
                                        name: "Use of emotional support",
                                        items: [
                                            "I've been getting emotional support from others.",
                                            "I've been getting comfort and understanding from someone.",
                                        ],
                                    },
                                    {
                                        name: "Use of instrumental support",
                                        items: [
                                            "I've been getting help and advice from other people.",
                                            "I've been trying to get advice or help from other people about what to do.",
                                        ],
                                    },
                                    {
                                        name: "Behavioral disengagement",
                                        items: ["I've been giving up trying to deal with it.", "I've been giving up the attempt to cope."],
                                    },
                                    {
                                        name: "Venting",
                                        items: [
                                            "I've been saying things to let my unpleasant feelings escape.",
                                            "I've been expressing my negative feelings.",
                                        ],
                                    },
                                    {
                                        name: "Positive reframing",
                                        items: [
                                            "I've been trying to see it in a different light, to make it seem more positive.",
                                            "I've been looking for something good in what is happening.",
                                        ],
                                    },
                                    {
                                        name: "Planning",
                                        items: [
                                            "I've been trying to come up with a strategy about what to do.",
                                            "I've been thinking hard about what steps to take.",
                                        ],
                                    },
                                    {
                                        name: "Humor",
                                        items: ["I've been making jokes about it.", "I've been making fun of the situation."],
                                    },
                                    {
                                        name: "Acceptance",
                                        items: [
                                            "I've been accepting the reality of the fact that it has happened.",
                                            "I've been learning to live with it.",
                                        ],
                                    },
                                    {
                                        name: "Religion",
                                        items: [
                                            "I've been trying to find comfort in my religion or spiritual beliefs.",
                                            "I've been praying or meditating.",
                                        ],
                                    },
                                    {
                                        name: "Self-blame",
                                        items: ["I've been criticizing myself.", "I've been blaming myself for things that happened."],
                                    },
                                ],
                            },
                            {
                                name: "Defense Style Questionnaire",
                                short_name: "DSQ-40",
                                total_items: 40,
                                instructions: "Please indicate your degree of agreement or disagreement with the following statements.",
                                scale: "9-point Likert",
                                references: [],
                                notes: "Measures 20 specific defense mechanisms (2 items each) rolling up into Mature, Neurotic, and Immature styles.",
                                dimensions: [
                                    { name: "Mature", items: [] },
                                    { name: "Neurotic", items: [] },
                                    { name: "Immature", items: [] },
                                ],
                            },
                            {
                                name: "Comprehensive assessment of Acceptance and Commitment Therapy processes",
                                short_name: "CompACT-8",
                                total_items: 8,
                                instructions: "Please indicate how true each statement is for you recently.",
                                scale: "7-point Likert",
                                references: [],
                                notes: "Measures three dimensions of psychological flexibility.",
                                dimensions: [
                                    { name: "Openness to Experience", items: [] },
                                    { name: "Behavioral Awareness", items: [] },
                                    { name: "Valued Action", items: [] },
                                ],
                            },
                            {
                                name: "Acceptance and Action Questionnaire",
                                short_name: "AAQ-II",
                                total_items: 7,
                                instructions: "Below you will find a list of statements. Please rate how true each statement is for you.",
                                scale: "7-point Likert (1 = Never true to 7 = Always true)",
                                references: ["Bond et al. (2011)"],
                                notes: "Standard measure for experiential avoidance and psychological inflexibility.",
                                dimensions: [
                                    {
                                        name: "Psychological Inflexibility",
                                        items: [
                                            "My painful experiences and memories make it difficult for me to live a life that I would value.",
                                            "I'm afraid of my feelings.",
                                            "I worry about not being able to control my worries and feelings.",
                                            "My painful memories prevent me from having a fulfilling life.",
                                            "Emotions cause problems in my life.",
                                            "It seems like most people are handling their lives better than I am.",
                                            "Worries get in the way of my success.",
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Connor-Davidson Resilience Scale 2",
                                short_name: "CD-RISC-2",
                                total_items: 2,
                                instructions:
                                    "Please indicate how much you agree with the following statements as they apply to you over the last month.",
                                scale: "5-point scale (0 = Not true at all to 4 = True nearly all the time)",
                                references: ["Vaishnavi et al. (2007)"],
                                notes: "Heavily validated measure of 'bounce-back' adaptability.",
                                dimensions: [
                                    {
                                        name: "Resilience",
                                        items: [
                                            "I am able to adapt when changes occur.",
                                            "I tend to bounce back after illness, injury, or other hardships.",
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        group: "Uncertainty, ambiguity, control, and mindset",
                        measures: [
                            {
                                name: "Intolerance of Uncertainty Scale - 4 Item",
                                short_name: "IUS-4",
                                total_items: 4,
                                instructions: "Please rate the extent to which you agree with each of the following statements.",
                                scale: "6-point Likert (1 = Strongly disagree to 6 = Strongly agree)",
                                references: ["Valencia et al. (2025)"],
                                notes: "Ultra-brief, unidimensional version of the IUS derived from the IUS-12. Demonstrates acceptable internal consistency (omega = 0.81) and full measurement invariance across sexes.",
                                dimensions: [
                                    {
                                        name: "Intolerance of Uncertainty",
                                        items: [
                                            "A small, unforeseen event can spoil everything, even with the best of planning.",
                                            "I always want to know what the future has in store for me.",
                                            "Uncertainty keeps me from living a full life",
                                            "I must get away from all uncertain situations.",
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Intolerance of Uncertainty Scale - Short Form",
                                short_name: "IUS-12",
                                total_items: 12,
                                instructions: "Please rate the extent to which you agree with each of the following statements.",
                                scale: "5-point Likert",
                                references: ["Carleton et al. (2007)"],
                                dimensions: [
                                    {
                                        name: "Prospective Anxiety",
                                        items: [
                                            "Unforeseen events upset me greatly.",
                                            "It frustrates me not having all the information I need.",
                                            "One should always look ahead so as to avoid surprises.",
                                            "A small unforeseen event can spoil everything, even with the best of planning.",
                                            "I always want to know what the future has in store for me.",
                                            "I can't stand being taken by surprise.",
                                            "I should be able to organize everything in advance.",
                                        ],
                                    },
                                    {
                                        name: "Inhibitory Anxiety",
                                        items: [
                                            "When it's time to act, uncertainty paralyses me.",
                                            "When I am uncertain I can't function very well.",
                                            "The smallest doubt can stop me from acting.",
                                            "I must get away from all uncertain situations.",
                                            "I can't stand being undecided about my future.",
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Multiple Stimulus Types Ambiguity Tolerance",
                                short_name: "MSTAT-II",
                                total_items: 13,
                                instructions: "Rate the extent to which you agree or disagree with the following statements.",
                                scale: "5-point Likert",
                                references: [],
                                notes: "Unidimensional scale, shorter and more modern than Budner scale.",
                                dimensions: [{ name: "Ambiguity Tolerance", items: [] }],
                            },
                            {
                                name: "Brief IPC Scale",
                                total_items: 9,
                                instructions: "Rate your agreement with the following statements.",
                                scale: "6-point Likert",
                                references: ["Sapp & Harrod (1993)"],
                                notes: "Brief version of Levenson's locus of control scale.",
                                dimensions: [
                                    { name: "Internal", items: [] },
                                    { name: "Powerful Others", items: [] },
                                    { name: "Chance", items: [] },
                                ],
                            },
                            {
                                name: "Growth Mindset Scale",
                                total_items: 3,
                                instructions: "Please indicate how much you agree with the following statements about intelligence.",
                                scale: "6-point Likert",
                                references: ["Rammstedt & Grüning (2023)"],
                                notes: "Brief version of Dweck's mindset measure.",
                                dimensions: [{ name: "Growth Mindset", items: [] }],
                            },
                        ],
                    },
                ],
            },
            {
                category: "Subjective Well-Being and Quality of Life",
                groups: [
                    {
                        group: "Subjective well-being and quality of life",
                        measures: [
                            {
                                name: "Single-Item Life Satisfaction Scale",
                                short_name: "SILS",
                                total_items: 1,
                                instructions: "Please answer the following question about your life.",
                                scale: "11-point scale (0 = Totally dissatisfied to 10 = Totally satisfied)",
                                references: ["Jovanović & Lazić (2020)"],
                                dimensions: [
                                    {
                                        name: "Life Satisfaction",
                                        items: ["All things considered, how satisfied are you with your life as a whole?"],
                                    },
                                ],
                            },
                            {
                                name: "Single-Item Happiness Scale",
                                short_name: "SHS-1",
                                total_items: 1,
                                instructions: "Please rate your overall happiness.",
                                scale: "11-point scale (0 = Extremely unhappy to 10 = Extremely happy)",
                                references: ["Abdel-Khalek (2006)"],
                                dimensions: [{ name: "Happiness", items: ["In general, how happy or unhappy do you usually feel?"] }],
                            },
                            {
                                name: "Essential QoL-3",
                                total_items: 3,
                                instructions: "Please rate your overall quality of life.",
                                scale: "11-point scale",
                                references: ["Schumann et al. (2023)"],
                                notes: "Covers global life satisfaction, happiness, and meaningfulness.",
                                dimensions: [
                                    { name: "Life Satisfaction", items: [] },
                                    { name: "Happiness", items: [] },
                                    { name: "Meaningfulness", items: [] },
                                ],
                            },
                            {
                                name: "Positive bubbles",
                                total_items: 3,
                                instructions: "Please rate how much these states applied to you:",
                                scale: "Visual analogue / Bubbles",
                                references: ["Brailovskaia & Margraf (2024)"],
                                notes: "One-item bubble scales for positive mental health, life satisfaction, and perceived social support.",
                                dimensions: [
                                    { name: "Positive Mental Health", items: [] },
                                    { name: "Life Satisfaction", items: [] },
                                    { name: "Perceived Social Support", items: [] },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: "Personality, Cognition, and Individual Differences",
        categories: [
            {
                category: "Basic Personality Traits",
                groups: [
                    {
                        group: "Big Five",
                        measures: [
                            {
                                name: "Ten-Item Personality Inventory",
                                short_name: "TIPI",
                                total_items: 10,
                                instructions:
                                    "Here are a number of personality traits that may or may not apply to you. Please indicate the extent to which you agree or disagree with that statement. You should rate the extent to which the pair of traits applies to you, even if one characteristic applies more strongly than the other.",
                                scale: "7-point Likert (1 = Disagree strongly to 7 = Agree strongly)",
                                references: ["Gosling et al. (2003)"],
                                dimensions: [
                                    { name: "Extraversion", items: ["Extraverted, enthusiastic.", "Reserved, quiet. (Reverse)"] },
                                    { name: "Agreeableness", items: ["Sympathetic, warm.", "Critical, quarrelsome. (Reverse)"] },
                                    {
                                        name: "Conscientiousness",
                                        items: ["Dependable, self-disciplined.", "Disorganized, careless. (Reverse)"],
                                    },
                                    {
                                        name: "Emotional Stability",
                                        items: ["Calm, emotionally stable.", "Anxious, easily upset. (Reverse-keyed)"],
                                    },
                                    {
                                        name: "Openness",
                                        items: ["Open to new experiences, complex.", "Conventional, uncreative. (Reverse)"],
                                    },
                                ],
                            },
                            {
                                name: "Big Five Inventory - 10",
                                short_name: "BFI-10",
                                total_items: 10,
                                instructions:
                                    "How well do the following statements describe your personality? I see myself as someone who...",
                                scale: "5-point Likert (1 = Disagree strongly to 5 = Agree strongly)",
                                references: ["Rammstedt & John (2007)", "Mastrascusa et al. (2023)"],
                                dimensions: [
                                    { name: "Extraversion", items: ["...is outgoing, sociable.", "...is reserved. (Reverse)"] },
                                    {
                                        name: "Agreeableness",
                                        items: ["...is generally trusting.", "...tends to find fault with others. (Reverse)"],
                                    },
                                    { name: "Conscientiousness", items: ["...does a thorough job.", "...tends to be lazy. (Reverse)"] },
                                    {
                                        name: "Neuroticism",
                                        items: ["...gets nervous easily.", "...is relaxed, handles stress well. (Reverse-keyed)"],
                                    },
                                    {
                                        name: "Openness",
                                        items: ["...has an active imagination.", "...has few artistic interests. (Reverse)"],
                                    },
                                ],
                            },
                            {
                                name: "Big Five Inventory-2 Extra-Short Form",
                                short_name: "BFI-2-XS",
                                total_items: 15,
                                instructions:
                                    "Here are a number of characteristics that may or may not apply to you. For example, do you agree that you are someone who likes to spend time with others? Please write a number next to each statement to indicate the extent to which you agree or disagree with that statement. I am someone who...",
                                scale: "5-point Likert",
                                references: ["Soto & John (2017)"],
                                notes: "3 items per domain, better content validity than TIPI/BFI-10.",
                                dimensions: [
                                    {
                                        name: "Extraversion",
                                        items: ["Tends to be quiet. (Reverse)", "Is dominant, acts as a leader.", "Is full of energy."],
                                    },
                                    {
                                        name: "Agreeableness",
                                        items: [
                                            "Is compassionate, has a soft heart.",
                                            "Is sometimes rude to others. (Reverse)",
                                            "Assume the best about people.",
                                        ],
                                    },
                                    {
                                        name: "Conscientiousness",
                                        items: [
                                            "Tends to be disorganized. (Reverse)",
                                            "Has difficulty getting started on tasks. (Reverse)",
                                            "Is reliable, can always be counted on.",
                                        ],
                                    },
                                    {
                                        name: "Negative Emotionality",
                                        items: [
                                            "Worries a lot.",
                                            "Tends to feel depressed, blue.",
                                            "Is emotionally stable, not easily upset. (Reverse)",
                                        ],
                                    },
                                    {
                                        name: "Open-Mindedness",
                                        items: [
                                            "Is fascinated by art, music, or literature.",
                                            "Has little interest in abstract ideas. (Reverse)",
                                            "Is original, comes up with new ideas.",
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Five-Item Personality Inventory",
                                short_name: "FIPI",
                                total_items: 5,
                                instructions: "Please indicate the extent to which you agree or disagree with that statement.",
                                scale: "7-point Likert",
                                references: ["Gosling et al. (2003)"],
                                dimensions: [
                                    {
                                        name: "Extraversion",
                                        items: [
                                            "I see myself as extraverted, enthusiastic (that is, sociable, assertive, talkative, active, NOT reserved or shy).",
                                        ],
                                    },
                                    {
                                        name: "Agreeableness",
                                        items: [
                                            "I see myself as agreeable, kind (that is, trusting, generous, sympathetic, cooperative, NOT aggressive or cold).",
                                        ],
                                    },
                                    {
                                        name: "Conscientiousness",
                                        items: [
                                            "I see myself as dependable, organized (that is, hard-working, responsible, self-disciplined, thorough, NOT careless or impulsive).",
                                        ],
                                    },
                                    {
                                        name: "Emotional Stability",
                                        items: [
                                            "I see myself as emotionally stable, calm (that is, relaxed, self-confident, NOT anxious, moody, easily upset, or easily stressed).",
                                        ],
                                    },
                                    {
                                        name: "Openness",
                                        items: [
                                            "I see myself as open to experience, imaginative (that is, curious, reflective, creative, deep, open-minded, NOT conventional).",
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Single-Item Measures of Personality",
                                short_name: "SIMP",
                                total_items: 5,
                                instructions: "Where would you place yourself on the following scales?",
                                scale: "9-point bipolar scale",
                                references: ["Woods & Hampson (2005)"],
                                notes: "Bipolar adjective pairs.",
                                dimensions: [],
                            },
                            {
                                name: "Mini-IPIP",
                                total_items: 20,
                                instructions: "Describe yourself as you generally are now, not as you wish to be in the future.",
                                scale: "5-point Likert",
                                references: ["Donnellan et al. (2006)"],
                                dimensions: [],
                            },
                        ],
                    },
                    {
                        group: "Big Six / HEXACO",
                        measures: [
                            {
                                name: "Brief HEXACO Inventory",
                                short_name: "BHI",
                                total_items: 24,
                                instructions: "Please indicate how much you agree with the following statements.",
                                scale: "5-point Likert",
                                references: ["De Vries (2013)"],
                                notes: "4 items per HEXACO domain.",
                                dimensions: [
                                    { name: "Honesty-Humility", items: [] },
                                    { name: "Emotionality", items: [] },
                                    { name: "Extraversion", items: [] },
                                    { name: "Agreeableness", items: [] },
                                    { name: "Conscientiousness", items: [] },
                                    { name: "Openness to Experience", items: [] },
                                ],
                            },
                            {
                                name: "Age-Invariant HEXACO Short Scale",
                                short_name: "HEX-ACO-18",
                                total_items: 18,
                                instructions: "Please indicate your agreement with the following statements.",
                                scale: "5-point Likert",
                                references: ["Olaru & Jankowsky (2022)"],
                                notes: "3 items per domain, scalar measurement invariance across ages 16–90.",
                                dimensions: [],
                            },
                            {
                                name: "Mini-IPIP6",
                                total_items: 24,
                                instructions: "Describe yourself as you generally are now.",
                                scale: "5-point Likert",
                                references: [],
                                notes: "TODO",
                                dimensions: [],
                            },
                        ],
                    },
                ],
            },
            {
                category: "Maladaptive and Antagonistic Traits",
                groups: [
                    {
                        group: "Maladaptive, antagonistic, and dark personality",
                        measures: [
                            {
                                name: "Personality Inventory for DSM-5 – Brief Form",
                                short_name: "PID-5-BF",
                                total_items: 25,
                                instructions: "Please rate how well each of the following statements describes you.",
                                scale: "4-point scale (0 = Very false or often false to 3 = Very true or often true)",
                                references: ["Krueger et al. (2013)", "Anderson et al. (2018)"],
                                notes: "5 items × 5 domains.",
                                dimensions: [
                                    { name: "Negative Affectivity", items: [] },
                                    { name: "Detachment", items: [] },
                                    { name: "Antagonism", items: [] },
                                    { name: "Disinhibition", items: [] },
                                    { name: "Psychoticism", items: [] },
                                ],
                            },
                            {
                                name: "Single Item Narcissism Scale",
                                short_name: "SINS",
                                total_items: 1,
                                instructions: "Please answer the following question.",
                                scale: "7-point Likert",
                                references: ["Konrath et al. (2014)"],
                                dimensions: [
                                    {
                                        name: "Narcissism",
                                        items: [
                                            "To what extent do you agree with this statement: I am a narcissist. (Note: The word 'narcissist' means egotistical, self-focused, and vain.).",
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Ultra-Short Dark Triad",
                                short_name: "uSDT",
                                total_items: 9,
                                instructions: "Please indicate your degree of agreement or disagreement with each statement.",
                                scale: "5-point Likert",
                                references: ["Wehner et al. (2021)"],
                                dimensions: [
                                    { name: "Machiavellianism", items: [] },
                                    { name: "Narcissism", items: [] },
                                    { name: "Psychopathy", items: [] },
                                ],
                            },
                            {
                                name: "Dirty Dozen",
                                short_name: "DD",
                                total_items: 12,
                                instructions: "Please indicate how much you agree with these statements.",
                                scale: "9-point Likert",
                                references: ["Jonason & Webster (2010)"],
                                notes: "4 items × 3 dark traits.",
                                dimensions: [
                                    { name: "Machiavellianism", items: [] },
                                    { name: "Narcissism", items: [] },
                                    { name: "Psychopathy", items: [] },
                                ],
                            },
                            {
                                name: "Short Dark Triad",
                                short_name: "SD3",
                                total_items: 27,
                                instructions: "Please indicate how much you agree with the following statements.",
                                scale: "5-point Likert (1 = Strongly Disagree to 5 = Strongly Agree)",
                                references: ["Jones & Paulhus (2014)"],
                                notes: "9 items × 3 dark traits.",
                                dimensions: [
                                    { name: "Machiavellianism", items: [] },
                                    { name: "Narcissism", items: [] },
                                    { name: "Psychopathy", items: [] },
                                ],
                            },
                            {
                                name: "Authoritarianism – Ultra Short",
                                short_name: "A-US",
                                total_items: 3,
                                instructions: "Please indicate your agreement.",
                                scale: "5-point Likert",
                                references: ["Heller et al. (2020)"],
                                dimensions: [{ name: "Authoritarianism", items: [] }],
                            },
                            {
                                name: "Very Short Form of the Short Dark Tetrad",
                                short_name: "SD4-VSF",
                                total_items: 16,
                                instructions: "Please indicate your level of agreement with these statements.",
                                scale: "5-point Likert",
                                references: ["Akat (2025)"],
                                dimensions: [
                                    { name: "Machiavellianism", items: [] },
                                    { name: "Narcissism", items: [] },
                                    { name: "Psychopathy", items: [] },
                                    { name: "Sadism", items: [] },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                category: "Meaning, Cognition, and Self-Orientation",
                groups: [
                    {
                        group: "Meaning and coherence",
                        measures: [
                            {
                                name: "Meaning in Life Questionnaire",
                                short_name: "MLQ",
                                total_items: 10,
                                instructions:
                                    "Please take a moment to think about what makes your life and existence feel important and significant to you.",
                                scale: "7-point Likert (1 = Absolutely Untrue to 7 = Absolutely True)",
                                references: ["Steger et al. (2006)"],
                                dimensions: [
                                    { name: "Presence of Meaning", items: [] },
                                    { name: "Search for Meaning", items: [] },
                                ],
                            },
                            {
                                name: "Brief Assessment of Sense of Coherence",
                                short_name: "BASOC",
                                total_items: 3,
                                instructions: "Please rate how much you agree with the following statements.",
                                scale: "7-point Likert",
                                references: ["Schumann et al. (2003)"],
                                notes: "Outperformed the SOC-3 in reliability and validity.",
                                dimensions: [{ name: "Sense of Coherence", items: [] }],
                            },
                        ],
                    },
                    {
                        group: "Cognitive style and attention",
                        measures: [
                            {
                                name: "Mind Wandering Questionnaire",
                                short_name: "MWQ",
                                total_items: 5,
                                instructions: "Please indicate how often you have each of the following experiences.",
                                scale: "6-point Likert (1 = Almost never to 6 = Almost always)",
                                references: ["Mrazek et al. (2013)"],
                                notes: "Trait-like.",
                                dimensions: [{ name: "Mind Wandering", items: [] }],
                            },
                        ],
                    },
                    {
                        group: "Social status and subjective positioning",
                        measures: [
                            {
                                name: "MacArthur Scale of Subjective Social Status",
                                short_name: "MacArthur SSS",
                                total_items: 1,
                                instructions: "Consider where you stand in society.",
                                scale: "10-rung visual ladder scale",
                                references: ["Adler et al. (2000)"],
                                dimensions: [
                                    {
                                        name: "Subjective Social Status",
                                        items: [
                                            "Think of this ladder as representing where people stand in our society... Where would you place yourself on this ladder?",
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        domain: "Social, Interpersonal, and Occupational Psychology",
        categories: [
            {
                category: "Social, Relational, and Family Functioning",
                groups: [
                    {
                        group: "Attachment and close relationships",
                        measures: [
                            {
                                name: "Relationship Questionnaire",
                                short_name: "RQ",
                                total_items: 4,
                                instructions:
                                    "Please read each of the following paragraphs and rate the extent to which each describes your general relationship style.",
                                scale: "7-point Likert",
                                references: ["Bartholomew & Horowitz (1991)"],
                                dimensions: [
                                    { name: "Secure", items: [] },
                                    { name: "Dismissing", items: [] },
                                    { name: "Preoccupied", items: [] },
                                    { name: "Fearful", items: [] },
                                ],
                            },
                            {
                                name: "Experiences in Close Relationships - Short Form",
                                short_name: "ECR-S",
                                total_items: 12,
                                instructions: "The following statements concern how you feel in romantic relationships.",
                                scale: "7-point Likert",
                                references: ["Wei et al. (2007)"],
                                dimensions: [
                                    { name: "Anxiety", items: [] },
                                    { name: "Avoidance", items: [] },
                                ],
                            },
                            {
                                name: "Fear of Intimacy Components Questionnaire",
                                short_name: "FICQ",
                                total_items: 10,
                                instructions: "Rate how characteristic the following statements are of you.",
                                scale: "5-point Likert",
                                references: [],
                                dimensions: [
                                    { name: "Fear of Losing the Self", items: [] },
                                    { name: "Fear of Losing the Other", items: [] },
                                ],
                            },
                        ],
                    },
                    {
                        group: "Loneliness, belonging, and social media-related social threat",
                        measures: [
                            {
                                name: "Three-Item UCLA Loneliness Scale",
                                short_name: "TILS/UCLA-3",
                                total_items: 3,
                                instructions: "How often do you feel the way described below?",
                                scale: "3-point Likert (1 = Hardly Ever to 3 = Often)",
                                references: ["Hughes et al. (2004)"],
                                dimensions: [
                                    {
                                        name: "Loneliness",
                                        items: [
                                            "How often do you feel that you lack companionship?",
                                            "How often do you feel left out?",
                                            "How often do you feel isolated from others?",
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Fear of Missing Out 3-item",
                                short_name: "FoMO-3",
                                total_items: 3,
                                instructions: "Below is a collection of statements about your everyday experience.",
                                scale: "5-point Likert",
                                references: ["Hisham et al. (2025)"],
                                dimensions: [{ name: "Fear of Missing Out", items: [] }],
                            },
                        ],
                    },
                    {
                        group: "Family, caregiving, and cultural/interpersonal style",
                        measures: [
                            {
                                name: "Short Composite Codependency Scale",
                                short_name: "SCCS",
                                total_items: 9,
                                instructions: "Please rate how strongly you agree or disagree with the following statements.",
                                scale: "5-point Likert",
                                references: [],
                                dimensions: [
                                    { name: "Emotional Suppression", items: [] },
                                    { name: "Interpersonal Control", items: [] },
                                    { name: "Self-Sacrifice", items: [] },
                                ],
                            },
                            {
                                name: "Cultural Humility Short Form",
                                short_name: "CHS-SF",
                                total_items: 6,
                                instructions:
                                    "Please rate your agreement with the following statements regarding your approach to others' cultural backgrounds.",
                                scale: "5-point Likert",
                                references: ["Coleman et al. (2024)", "Hook et al. (2013)"],
                                dimensions: [
                                    { name: "Positive Humility", items: [] },
                                    { name: "Negative Humility", items: [] },
                                ],
                            },
                            {
                                name: "Parenting Scale – 4 item",
                                short_name: "PS-4",
                                total_items: 4,
                                instructions:
                                    "At times all children misbehave or do things that could be harmful. Please indicate how you deal with your child.",
                                scale: "7-point bipolar scale",
                                references: ["Schmalbach et al. (2026)", "Arnold et al."],
                                dimensions: [
                                    { name: "Overreactivity", items: [] },
                                    { name: "Laxness", items: [] },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                category: "Work and Organisational Functioning",
                groups: [
                    {
                        group: "Global attitudes and job satisfaction",
                        measures: [
                            {
                                name: "Global Job Satisfaction",
                                short_name: "GJS",
                                total_items: 1,
                                instructions: "Please answer the following question about your current job.",
                                scale: "Varying Likert scales (typically 5-point or 7-point)",
                                references: ["Wanous et al. (1997)"],
                                dimensions: [{ name: "Global Job Satisfaction", items: ["Overall, how satisfied are you with your job?"] }],
                            },
                        ],
                    },
                    {
                        group: "Work engagement",
                        measures: [
                            {
                                name: "Utrecht Work Engagement Scale - 3 item",
                                short_name: "UWES-3",
                                total_items: 3,
                                instructions: "Please read each statement carefully and decide if you ever feel this way about your job.",
                                scale: "7-point Likert (0 = Never to 6 = Always/Every day)",
                                references: ["Schaufeli et al. (2019)"],
                                dimensions: [
                                    { name: "Vigor", items: ["At my work, I feel bursting with energy."] },
                                    { name: "Dedication", items: ["I am enthusiastic about my job."] },
                                    { name: "Absorption", items: ["I am immersed in my work."] },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]
