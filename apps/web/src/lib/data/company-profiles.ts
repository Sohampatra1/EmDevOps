export const COMPANY_PROFILES: Record<string, any> = {
    bosch: {
        name: 'Bosch',
        logo: '🔧',
        focus: ['AUTOSAR', 'ISO 26262', 'CAN/CAN-FD', 'Embedded Linux', 'C/C++'],
        dsaDifficulty: 'MEDIUM',
        embeddedDepth: 'HIGH',
        safetyEmphasis: 'HIGH',
        devopsStack: ['GitLab CI', 'Docker', 'CMake', 'Azure IoT'],
        interviewTips: [
            'Bosch values deep embedded hardware-software understanding.',
            'Expect questions about AUTOSAR architecture and memory layout.',
            'Code quality, MISRA compliance, and safety standards are critical.',
            'Be prepared for real-time system design questions (RTOS scheduling).'
        ],
        interviewRounds: [
            { name: "HR Screening", description: "30 min call discussing your background, visa status (if applicable), and salary expectations." },
            { name: "Technical Round 1 (C/C++ & Microcontrollers)", description: "60 mins focusing on bit manipulation, pointer arithmetic, memory management (volatile, ISRs), and basic C++ OOP concepts." },
            { name: "Technical Round 2 (Domain Specific)", description: "60 mins based on the exact role. If AUTOSAR: Can/Lin routing, RTE configuration. If DevOps: GitLab CI pipelines, Yocto build optimization, Docker." },
            { name: "Managerial / Cultural", description: "45 mins discussing teamwork, handling pressure during ECU release deadlines, and long-term career goals." }
        ]
    },
    siemens: {
        name: 'Siemens',
        logo: '⚡',
        focus: ['Industrial IoT', 'PLC Programming', 'Embedded Linux', 'Azure IoT'],
        dsaDifficulty: 'MEDIUM',
        embeddedDepth: 'MEDIUM',
        safetyEmphasis: 'MEDIUM',
        devopsStack: ['Azure DevOps', 'Docker', 'CMake', 'Azure IoT Hub'],
        interviewTips: [
            'Siemens focuses heavily on industrial automation (SIMATIC) and IoT.',
            'Expect questions about cloud connectivity, edge computing, and MQTT.',
            'Python scripting for automation is highly valued.',
            'Understanding of industrial protocols (OPC-UA, Modbus) is a plus.'
        ],
        interviewRounds: [
            { name: "Online Assessment", description: "HackerRank test with 2 Easy/Medium algorithms and 10 MCQs on OS/Linux concepts." },
            { name: "Technical Interview (Software Engineering)", description: "Coding in C++ or Python. Focus on strings, graphs, and basic algorithms. Design patterns (Factory, Observer)." },
            { name: "System Design (Industrial Edge)", description: "Designing an IoT gateway that aggregates sensor data, connects to Azure IoT, and handles offline buffering." },
            { name: "Team Fit", description: "Interview with the team lead and future colleagues." }
        ]
    },
    continental: {
        name: 'Continental',
        logo: '🛞',
        focus: ['ADAS', 'Safety', 'CAN', 'AUTOSAR', 'Embedded C/C++'],
        dsaDifficulty: 'HARD',
        embeddedDepth: 'HIGH',
        safetyEmphasis: 'HIGH',
        devopsStack: ['GitLab CI', 'Docker', 'CMake', 'AWS'],
        interviewTips: [
            'Strong focus on ADAS (Advanced Driver Assistance Systems).',
            'Expect deep C/C++ and real-time programming constraints.',
            'ISO 26262 and ASIL functional safety knowledge is essential.',
            'System-level design discussions around fail-operational capabilities.'
        ],
        interviewRounds: [
            { name: "Technical Phone Screen", description: "Questions on basic C, memory leaks, and what happens during the boot sequence of an MCU." },
            { name: "Deep Technical (Whiteboard)", description: "Live coding focusing on bit manipulation, custom memory allocators, or implementing a circular buffer. Heavy scrutiny on edge cases." },
            { name: "System/Architecture Round", description: "Designing a fail-safe braking system component. Discussion on ASIL levels and redundancy." }
        ]
    },
    bmw: {
        name: 'BMW',
        logo: '🚗',
        focus: ['Infotainment', 'Qt/QML', 'Embedded Linux', 'Connected Car'],
        dsaDifficulty: 'HARD',
        embeddedDepth: 'HIGH',
        safetyEmphasis: 'MEDIUM',
        devopsStack: ['GitLab CI', 'Docker', 'Yocto', 'AWS IoT'],
        interviewTips: [
            'BMW (often via joint ventures) values both embedded depth and modern software practices.',
            'Qt/QML knowledge is required for UI/Infotainment roles.',
            'Connected car (SOME/IP, Ethernet) and OTA update knowledge is highly valued.',
            'They expect clean, modern C++ (14/17).'
        ],
        interviewRounds: [
            { name: "HR & Initial Technical", description: "Background check and high-level questions on C++ features and Linux." },
            { name: "Coding Assignment (Take-Home or Live)", description: "Often a Yocto recipe creation task or a modern C++ application handling concurrent data streams." },
            { name: "System Architecture & Review", description: "Reviewing the coding assignment, discussing Yocto build optimizations, containerized cross-compilation, and connected-car backend integration." }
        ]
    },
    elektrobit: {
        name: 'Elektrobit',
        logo: '💡',
        focus: ['AUTOSAR', 'OTA', 'Embedded Linux', 'Diagnostics'],
        dsaDifficulty: 'MEDIUM',
        embeddedDepth: 'HIGH',
        safetyEmphasis: 'HIGH',
        devopsStack: ['GitLab CI', 'Docker', 'CMake', 'Azure'],
        interviewTips: [
            'Pure embedded/automotive software supplier (owned by Continental).',
            'Deep AUTOSAR Classic/Adaptive knowledge is expected.',
            'OTA update architecture and security questions are common.',
            'Understanding of UDS/DoIP diagnostics is important.'
        ],
        interviewRounds: [
            { name: "Technical Call", description: "Focus on UDS services, CAN frames, and basic C." },
            { name: "Deep Dive Interview", description: "Extensive discussion on RTOS task scheduling, priority inversion, mutual exclusion, and debugging hard faults." },
            { name: "Managerial", description: "Fit within the project team and customer-facing communication skills." }
        ]
    },
    apple: {
        name: 'Apple',
        logo: '🍎',
        focus: ['Cellular Firmware', 'Power Management', 'C/C++', 'RTOS'],
        dsaDifficulty: 'HARD',
        embeddedDepth: 'EXPERT',
        safetyEmphasis: 'MEDIUM',
        devopsStack: ['Jenkins', 'Python', 'Make', 'Custom Apple CI'],
        interviewTips: [
            'Apple Munich (Silicon Design Center) focuses heavily on cellular modems, power management, and mixed-signal chips.',
            'Expect extremely difficult C and bit manipulation questions.',
            'Deep understanding of computer architecture (caches, pipelines, memory barriers) is expected.',
            'Prepare for intense LeetCode Medium/Hard questions alongside hardware interactions.'
        ],
        interviewRounds: [
            { name: "Recruiter Screen", description: "30 mins. Assessing timeline, compensation, and general match." },
            { name: "Technical Phone Screen", description: "45-60 mins. Live coding via CoderPad. Focus on bitwise operations, linked lists, or string parsing in C." },
            { name: "Onsite Loop (5-6 Interviews)", description: "Exhaustive day. 1. System Design (e.g. designing an RTOS scheduler). 2. Firmware Coding (Interrupt handlers, registers). 3. Algorithms (Leetcode Hard). 4. Computer Architecture. 5. Behavioral with Director." }
        ]
    },
    google: {
        name: 'Google',
        logo: '🔍',
        focus: ['Wearables (Fitbit)', 'Android Automotive', 'Embedded Linux', 'C/C++'],
        dsaDifficulty: 'EXPERT',
        embeddedDepth: 'HIGH',
        safetyEmphasis: 'MEDIUM',
        devopsStack: ['Bazel', 'GCP', 'Docker', 'Python'],
        interviewTips: [
            'Google Munich develops wearables and browser privacy amongst other things. Android Automotive is also big.',
            'Unlike traditional automotive, Google expects top-tier general algorithmic skills (Graph algorithms, Dynamic Programming).',
            'Strong emphasis on testing, clean code, and scalable build systems (Bazel) for DevOps roles.'
        ],
        interviewRounds: [
            { name: "Recruiter Screen", description: "Standard Google HR screening." },
            { name: "Technical Phone Screen", description: "45 mins. Pure DSA. Expect trees, graphs, or complex string manipulation." },
            { name: "Onsite Loop (4-5 Interviews)", description: "3-4 Coding and Algorithms rounds (Heavy DSA, even for embedded). 1 Googliness & Leadership round. For embedded specific roles, one round will test OS concepts and Linux internals." }
        ]
    },
    tesla: {
        name: 'Tesla',
        logo: '⚡',
        focus: ['Firmware Development', 'Automation', 'Python', 'C'],
        dsaDifficulty: 'HARD',
        embeddedDepth: 'HIGH',
        safetyEmphasis: 'HIGH',
        devopsStack: ['GitLab', 'Python', 'Docker', 'Jenkins'],
        interviewTips: [
            'Tesla Gigafactory Berlin hires heavily for manufacturing automation and vehicle firmware.',
            'Interviews are intense and highly practical. They want "hardcore" engineers.',
            'First-principles thinking is heavily tested. Expect to explain physics/hardware concepts.'
        ],
        interviewRounds: [
            { name: "Take-Home Project or Live Coding", description: "Create a parser for a specific binary format or write a control loop simulation." },
            { name: "Technical Screen", description: "Review of the project. Deep dive into C, memory management, and debugging." },
            { name: "Panel Interview", description: "Rapid-fire technical questions from 3-4 engineers. Highly stressful by design. Focus on hardware-software interfaces and what you do when things break." }
        ]
    },
    cariad: {
        name: 'CARIAD',
        logo: '🚙',
        focus: ['VW.OS', 'Adaptive AUTOSAR', 'C++14/17', 'Cloud Backend'],
        dsaDifficulty: 'MEDIUM',
        embeddedDepth: 'HIGH',
        safetyEmphasis: 'HIGH',
        devopsStack: ['GitHub Actions', 'AWS', 'Docker', 'Yocto'],
        interviewTips: [
            'VW Group software company. Building the unified VW.OS platform.',
            'Huge focus on modern C++ (14/17) and service-oriented architecture (SOME/IP).',
            'For DevOps: Massive focus on Yocto, Bazel/CMake, and scaling CI/CD across thousands of developers.'
        ],
        interviewRounds: [
            { name: "HR Screen", description: "Standard fit and background." },
            { name: "Technical Live Coding", description: "Modern C++ features (smart pointers, lambdas, concurrency) and basic algorithms." },
            { name: "System Design", description: "Designing an OTA update platform for 10 million vehicles, handling A/B partitions, security, and bandwidth constraints." }
        ]
    },
    infineon: {
        name: 'Infineon',
        logo: '🏎️',
        focus: ['AURIX Microcontrollers', 'Hardware Security', 'Bare-metal C'],
        dsaDifficulty: 'MEDIUM',
        embeddedDepth: 'EXPERT',
        safetyEmphasis: 'EXPERT',
        devopsStack: ['Jenkins', 'Python', 'Make'],
        interviewTips: [
            'Headquartered in Munich. Major supplier of automotive microcontrollers (AURIX).',
            'Expect questions on hardware security modules (HSM), cryptographic accelerators, and bare-metal programming.',
            'Deep hardware architectures (multi-core, lockstep) are common topics.'
        ],
        interviewRounds: [
            { name: "Technical Screen", description: "Testing low-level C programming, volatile keyword, bitmasks, and linker scripts." },
            { name: "Architecture Round", description: "Discussion on multi-core MCU architectures, cache coherency, and managing memory protection units (MPU)." },
            { name: "Team Fit", description: "Meeting the specific division (e.g., Automotive Security or Radar)." }
        ]
    },
    nxp: {
        name: 'NXP Semiconductors',
        logo: '📡',
        focus: ['V2X Communication', 'NFC/RFID', 'Embedded Linux', 'U-Boot'],
        dsaDifficulty: 'MEDIUM',
        embeddedDepth: 'HIGH',
        safetyEmphasis: 'HIGH',
        devopsStack: ['Yocto', 'Jenkins', 'Make', 'Bash'],
        interviewTips: [
            'Major offices in Hamburg and Munich. Strong in automotive radar, V2X, and secure payment chips.',
            'Embedded Linux BSP, U-Boot, and device tree knowledge is highly sought after.'
        ],
        interviewRounds: [
            { name: "Technical Screen", description: "Linux kernel architecture, writing a basic char device driver pseudo-code." },
            { name: "Deep Dive", description: "Debugging a kernel panic. Yocto recipe manipulation. Board bring-up sequence from power-on to user space." }
        ]
    },
    asml: {
        name: 'ASML',
        logo: '🔬',
        focus: ['Lithography Control', 'VxWorks/RTOS', 'C/C++', 'Python'],
        dsaDifficulty: 'HARD',
        embeddedDepth: 'HIGH',
        safetyEmphasis: 'MEDIUM',
        devopsStack: ['ClearCase/Git', 'Python', 'Jenkins', 'Linux'],
        interviewTips: [
            'While Dutch, ASML has major R&D in Berlin. Produces the world\'s most complex lithography machines.',
            'Extreme precision and determinism. Heavy use of RTOS and highly optimized C++.',
            'Complex mathematical modelling and control systems knowledge is a massive plus.'
        ],
        interviewRounds: [
            { name: "Online Test", description: "C++ fundamentals and mathematics." },
            { name: "Technical Interview", description: "Concurrency in C++, data races, and designing a control loop bounded by microsecond constraints." },
            { name: "System Design", description: "Designing a software component that controls a highly calibrated mirror array, dealing with hardware delays and calibration logic." }
        ]
    }
};
