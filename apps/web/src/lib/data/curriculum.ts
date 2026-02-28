export const CURRICULUM = {
    modules: [
        {
            name: 'Modern C & C++',
            slug: 'modern-c-cpp',
            description: 'Pointers, memory layout, C++11/14/17 features, templates, RAII, smart pointers',
            domain: 'embedded',
            icon: '⚡',
            order: 1,
            topics: [
                { name: 'Pointers & Memory Layout', slug: 'pointers-memory', description: 'Raw pointers, pointer arithmetic, memory segments (stack, heap, data, BSS)', order: 1 },
                { name: 'C++11/14/17 Features', slug: 'cpp-modern', description: 'Auto, constexpr, lambdas, move semantics, smart pointers, structured bindings', order: 2 },
                { name: 'Templates & Metaprogramming', slug: 'templates', description: 'Function/class templates, SFINAE, variadic templates, type traits', order: 3 },
                { name: 'RAII & Resource Management', slug: 'raii', description: 'RAII pattern, unique_ptr, shared_ptr, custom deleters, rule of 5', order: 4 },
                { name: 'Concurrency in C++', slug: 'cpp-concurrency', description: 'std::thread, mutexes, condition variables, atomics, lock-free structures', order: 5 },
            ]
        },
        {
            name: 'Embedded Linux',
            slug: 'embedded-linux',
            description: 'Yocto Project, Buildroot, U-Boot, kernel modules, device trees, systemd',
            domain: 'embedded',
            icon: '🐧',
            order: 2,
            topics: [
                { name: 'Yocto Project', slug: 'yocto', description: 'Meta-layers, recipes, BitBake, image creation, SDK generation', order: 1 },
                { name: 'Buildroot', slug: 'buildroot', description: 'Configuration, cross-compilation, rootfs overlay, package management', order: 2 },
                { name: 'U-Boot & Boot Process', slug: 'uboot', description: 'Bootloader configuration, device tree, SPL, FIT images', order: 3 },
                { name: 'Kernel Modules', slug: 'kernel-modules', description: 'Loadable kernel modules, character devices, ioctl, sysfs', order: 4 },
                { name: 'Device Trees', slug: 'device-trees', description: 'DTS syntax, bindings, overlays, runtime configuration', order: 5 },
                { name: 'systemd & Service Management', slug: 'systemd', description: 'Unit files, targets, timers, journal, socket activation', order: 6 },
                { name: 'APT & Debian Packaging', slug: 'debian-packaging', description: 'Creating .deb packages, apt repository management, dpkg internals', order: 7 },
            ]
        },
        {
            name: 'Qt/QML & Embedded UI',
            slug: 'qt-qml',
            description: 'Qt framework, QML, signals/slots, Qt for embedded, debugging UI state',
            domain: 'embedded',
            icon: '🎨',
            order: 3,
            topics: [
                { name: 'Qt Architecture', slug: 'qt-architecture', description: 'Qt modules, event loop, meta-object system, property system', order: 1 },
                { name: 'Signals & Slots', slug: 'signals-slots', description: 'Connection types, custom signals, slot mechanism, signal chaining', order: 2 },
                { name: 'QML Fundamentals', slug: 'qml-fundamentals', description: 'QML syntax, bindings, Component types, Qt Quick Controls', order: 3 },
                { name: 'C++/QML Integration', slug: 'cpp-qml-integration', description: 'Exposing C++ to QML, context properties, registered types', order: 4 },
                { name: 'Debugging Complex UI State', slug: 'qt-debugging', description: 'Qt Creator debugger, GammaRay, QML profiler, state machine debugging', order: 5 },
            ]
        },
        {
            name: 'Protocols & Automotive Standards',
            slug: 'protocols-auto',
            description: 'CAN, CAN-FD, LIN, UDS, AUTOSAR, ISO 26262, MISRA C/C++',
            domain: 'embedded',
            icon: '🚗',
            order: 4,
            topics: [
                { name: 'CAN & CAN-FD', slug: 'can-canfd', description: 'CAN 2.0A/B, CAN-FD, message format, arbitration, error handling', order: 1 },
                { name: 'LIN Protocol', slug: 'lin', description: 'LIN bus topology, master/slave, schedule table, diagnostics', order: 2 },
                { name: 'UDS (Unified Diagnostic Services)', slug: 'uds', description: 'Diagnostic sessions, services (0x10-0x3E), NRC, security access', order: 3 },
                { name: 'AUTOSAR Basics', slug: 'autosar', description: 'Classic vs Adaptive, SWC, RTE, BSW, service-oriented communication', order: 4 },
                { name: 'ISO 26262 & Functional Safety', slug: 'iso-26262', description: 'ASIL levels, safety lifecycle, FMEA, fault tree analysis', order: 5 },
                { name: 'MISRA C/C++', slug: 'misra', description: 'Rule categories, common violations, static analysis tools, compliance', order: 6 },
                { name: 'TCP/IP for Embedded', slug: 'tcpip-embedded', description: 'lwIP, socket programming, MQTT, CoAP for constrained devices', order: 7 },
            ]
        },
        {
            name: 'Testing & Safety',
            slug: 'testing-safety',
            description: 'TDD with GTest, unit testing, integration testing, safety compliance',
            domain: 'embedded',
            icon: '🛡️',
            order: 5,
            topics: [
                { name: 'TDD with Google Test', slug: 'gtest-tdd', description: 'GTest framework, test fixtures, mocking with GMock, TDD workflow', order: 1 },
                { name: 'Unit Testing for Embedded', slug: 'embedded-unit-testing', description: 'Testing without hardware, Hardware Abstraction Layer, test doubles', order: 2 },
                { name: 'Static Analysis', slug: 'static-analysis', description: 'Coverity, PC-lint, cppcheck, MISRA checker setup and CI integration', order: 3 },
            ]
        },
        {
            name: 'CI/CD Fundamentals',
            slug: 'ci-cd',
            description: 'GitLab CI, Azure DevOps, AWS embedded stack for continuous integration',
            domain: 'devops',
            icon: '🔄',
            order: 6,
            topics: [
                { name: 'GitLab CI', slug: 'gitlab-ci', description: 'Pipeline syntax, stages, jobs, artifacts, runners, Docker executors', order: 1 },
                { name: 'Azure DevOps', slug: 'azure-devops', description: 'YAML pipelines, build agents, release pipelines, test plans', order: 2 },
                { name: 'AWS for Embedded', slug: 'aws-embedded', description: 'AWS IoT Core, FreeRTOS, Greengrass, S3 for firmware artifacts', order: 3 },
            ]
        },
        {
            name: 'Containerization & Build Systems',
            slug: 'containers-builds',
            description: 'Docker for cross-compilation, Modern CMake, Autotools comparison',
            domain: 'devops',
            icon: '🐳',
            order: 7,
            topics: [
                { name: 'Docker for Cross-Compilation', slug: 'docker-cross', description: 'Multi-stage builds, cross-compiler images, BuildKit, volume mounts', order: 1 },
                { name: 'Modern CMake', slug: 'cmake', description: 'Target-based approach, find_package, toolchain files, CPack, CTest', order: 2 },
                { name: 'Autotools', slug: 'autotools', description: 'configure.ac, Makefile.am, autoreconf, cross-compilation, libtool', order: 3 },
                { name: 'CMake vs Autotools', slug: 'cmake-vs-autotools', description: 'Feature comparison, use cases, migration strategies, modern best practices', order: 4 },
            ]
        },
        {
            name: 'Cloud IoT & HIL',
            slug: 'cloud-iot-hil',
            description: 'Azure IoT Hub, AWS IoT, Hardware-in-the-Loop testing, Python scripting',
            domain: 'devops',
            icon: '☁️',
            order: 8,
            topics: [
                { name: 'Azure IoT Hub', slug: 'azure-iot', description: 'Device provisioning, D2C/C2D messaging, device twins, IoT Edge', order: 1 },
                { name: 'AWS IoT Core', slug: 'aws-iot', description: 'Thing registry, MQTT broker, rules engine, device shadows', order: 2 },
                { name: 'HIL Testing Automation', slug: 'hil-automation', description: 'Test rack setup, automation scripts, result aggregation, CI integration', order: 3 },
                { name: 'Python for CI Pipelines', slug: 'python-ci', description: 'pytest, test automation scripts, hardware control, result parsing', order: 4 },
            ]
        },
        {
            name: 'DSA for Embedded Interviews',
            slug: 'dsa',
            description: 'Arrays, Linked Lists, Bit Manipulation, Memory Management - focused on C/C++',
            domain: 'embedded',
            icon: '🧮',
            order: 9,
            topics: [
                { name: 'Arrays & Strings', slug: 'arrays-strings', description: 'In-place algorithms, XOR tricks, O(1) space solutions', order: 1 },
                { name: 'Linked Lists', slug: 'linked-lists', description: 'Reversal, cycle detection, merge, intersection', order: 2 },
                { name: 'Bit Manipulation', slug: 'bit-manipulation', description: 'Set bits, toggle, power of two, bitmasks, XOR properties', order: 3 },
                { name: 'Memory Management', slug: 'memory-management', description: 'Custom malloc, volatile, stack vs heap, alignment, memory pools', order: 4 },
            ]
        },
        {
            name: 'Embedded DevOps System Design',
            slug: 'system-design',
            description: 'Real-world system design scenarios from German automotive & industrial companies',
            domain: 'devops',
            icon: '🏗️',
            order: 10,
            topics: [
                { name: 'CI/CD for Automotive ECU Firmware', slug: 'sd-ecu-cicd', description: 'Bosch/Continental style pipeline: commit → SIL → HIL → flash', order: 1 },
                { name: 'OTA Update Architecture', slug: 'sd-ota', description: 'Secure FOTA with rollback, A/B partitioning (Elektrobit style)', order: 2 },
                { name: 'HIL Test Infrastructure', slug: 'sd-hil-infra', description: 'dSPACE/Vector-based HIL farm, CI integration, result aggregation', order: 3 },
                { name: 'Cross-Compilation Farm', slug: 'sd-cross-compile', description: 'Docker + Yocto SDK, multi-target builds (ARM/x86/PowerPC)', order: 4 },
                { name: 'BSP Build & Release Pipeline', slug: 'sd-bsp-release', description: 'Yocto meta-layers, release branching, license compliance (BMW/Audi)', order: 5 },
                { name: 'AUTOSAR CP vs AP Architecture', slug: 'sd-autosar', description: 'Classic vs Adaptive stacks, service-oriented communication', order: 6 },
                { name: 'ISO 26262 Safety Workflow', slug: 'sd-safety', description: 'ASIL decomposition, safety case toolchain, traceability', order: 7 },
                { name: 'V2X Communication System', slug: 'sd-v2x', description: 'Vehicle-to-Everything, DSRC/C-V2X, security certificates', order: 8 },
                { name: 'Digital Twin for ECU Validation', slug: 'sd-digital-twin', description: 'Virtual ECU simulation, SIL environment, continuous validation', order: 9 },
                { name: 'Secure Boot & HSM Integration', slug: 'sd-secure-boot', description: 'Root of trust, secure firmware chain (Infineon/Bosch)', order: 10 },
                { name: 'Multi-ECU Diagnostics (UDS/OBD)', slug: 'sd-diagnostics', description: 'Diagnostic server, fault memory, DTC handling (Vector/ETAS)', order: 11 },
                { name: 'ASPICE-Compliant DevOps', slug: 'sd-aspice', description: 'Mapping ASPICE SWE/SYS to CI/CD, audit-ready artifacts', order: 12 },
                { name: 'CAN/CAN-FD Gateway Design', slug: 'sd-can-gateway', description: 'Bus topology, message routing, DBC management, timing', order: 13 },
                { name: 'Embedded ML Pipeline (TinyML)', slug: 'sd-tinyml', description: 'Model → quantization → Cortex-M deployment (Bosch AI/Siemens)', order: 14 },
                { name: 'Fleet Telemetry & Predictive Maintenance', slug: 'sd-fleet', description: 'Edge computing, Azure/AWS, data pipeline to cloud analytics', order: 15 },
            ]
        },
    ]
};
