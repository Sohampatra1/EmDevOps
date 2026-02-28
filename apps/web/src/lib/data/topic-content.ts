export const TOPIC_CONTENT: Record<string, any> = {
    // --- MODERN C & C++ ---
    'pointers-memory': {
        overview: "Understanding raw memory access is the foundation of Embedded Software Engineering. In constrained environments, every byte counts, and understanding where and how memory is allocated (Stack vs Heap vs Data vs BSS) is critical for system stability.",
        germanContext: "German Tier-1 suppliers like Bosch and Continental heavily scrutinize memory management in interviews. Memory leaks or stack overflows in ECU (Electronic Control Unit) firmware can cause fatal automotive accidents. They look for engineers who default to stack allocation and understand the precise layout of a binary.",
        subtopics: [
            {
                title: "Raw Pointers and Arithmetic",
                theory: "A pointer stores a memory address. Pointer arithmetic allows moving through memory blocks (like arrays) by adding/subtracting the size of the underlying type. (e.g. `ptr + 1` moves by `sizeof(type)` bytes).",
                application: "Used extensively to map hardware registers. E.g., `volatile uint32_t* CAN_CTRL = (uint32_t*)0x40005000; *CAN_CTRL |= 1;`"
            },
            {
                title: "Memory Segments (.data, .bss, heap, stack)",
                theory: ".data holds initialized globals, .bss holds uninitialized globals (zeroed at startup). The Stack grows downwards (usually) and holds local tracking/variables. The Heap grows upwards and holds dynamic memory.",
                application: "Embedded linker scripts (.ld) map these segments to specific physical memory banks (e.g., fast SRAM for .data, slower external RAM for heap)."
            }
        ],
        resources: [
            { name: "MISRA C++ 2008 Guidelines (Rules on Pointers)", url: "https://www.misra.org.uk/" },
            { name: "Embedded C Coding Standard (Barr Group)", url: "https://barrgroup.com/embedded-systems/books/embedded-c-coding-standard" }
        ]
    },
    'raii': {
        overview: "Resource Acquisition Is Initialization (RAII) is a C++ programming technique which binds the life cycle of a resource (memory, mutex, socket) to the lifetime of an object holding it.",
        germanContext: "Companies like BMW and CARIAD utilizing modern C++14/17 in their infotainment and autonomous driving stacks (Adaptive AUTOSAR) strictly mandate RAII to prevent resource leaks in long-running automotive services.",
        subtopics: [
            {
                title: "Smart Pointers (std::unique_ptr, std::shared_ptr)",
                theory: "Smart pointers wrap raw pointers and automatically delete the managed object when they go out of scope. `unique_ptr` has exclusive ownership, `shared_ptr` uses reference counting.",
                application: "Replacing naked `new`/`delete` in embedded applications. E.g., receiving a dynamic payload over SOME/IP and managing its lifecycle with `std::unique_ptr`."
            },
            {
                title: "Lock Guards",
                theory: "`std::lock_guard` acquires a mutex on creation and releases it on destruction.",
                application: "Used in RTOS environments to ensure hardware resources (like an SPI bus) are unconditionally released even if an exception or early return occurs."
            }
        ],
        resources: [
            { name: "C++ Core Guidelines - Resource Management", url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource" }
        ]
    },

    // --- EMBEDDED LINUX ---
    'yocto': {
        overview: "The Yocto Project is an open-source collaboration project that helps developers create custom Linux-based systems for embedded products, regardless of the hardware architecture.",
        germanContext: "Virtually every major German automotive OEM (BMW, Audi, VW) and industrial player (Siemens) uses Yocto to build their Board Support Packages (BSPs). Embedded DevOps engineers are heavily recruited to maintain Yocto build pipelines, optimize BitBake caching, and manage meta-layers.",
        subtopics: [
            {
                title: "BitBake and Recipes (.bb)",
                theory: "BitBake is a task execution engine (similar to Make) that reads recipes to fetch, configure, compile, and package source code into deployable artifacts (IPK/RPM/DEB).",
                application: "Writing a recipe `my-app_1.0.bb` that fetches source from GitLab, compiles it using CMake, and installs it into `/usr/bin/` of the target root filesystem."
            },
            {
                title: "Meta-layers and Overlays",
                theory: "Yocto organizes configurations logically into layers (e.g., `meta-fsl-arm` for hardware, `meta-qt5` for UI). You use `bbappend` files to modify existing recipes without altering original source code.",
                application: "Creating a `meta-company` layer to cleanly separate proprietary application code from the open-source base layers, ensuring easy upstream upgrades."
            }
        ],
        resources: [
            { name: "Yocto Project Mega-Manual", url: "https://docs.yoctoproject.org/" },
            { name: "Bootlin Yocto Training Materials", url: "https://bootlin.com/training/yocto/" }
        ]
    },
    'kernel-modules': {
        overview: "Loadable Kernel Modules (LKMs) are object files that contain code to extend the running Linux kernel, allowing hardware drivers to be loaded dynamically without rebooting or recompiling the whole kernel.",
        germanContext: "Tier-1s like Bosch and Hella write custom device drivers for proprietary sensors and actuators. Embedded Software Engineers must know how to write memory-safe kernel code, as a panic here crashes the whole ECU.",
        subtopics: [
            {
                title: "Character Device Drivers",
                theory: "A char device provides unbuffered, direct access to the hardware device. It implements the standard file operations hook: `open`, `read`, `write`, `ioctl`, `release`.",
                application: "Writing a `/dev/my_sensor` driver that reads I2C data in the kernel space and exposes it to user-space applications via the `read()` system call."
            },
            {
                title: "Interrupt Handling in Kernel (Top/Bottom Halves)",
                theory: "ISRs (Top Halves) must execute extremely fast. Deferred work (Bottom Halves) is pushed to tasklets or workqueues to allow the CPU to re-enable interrupts quickly.",
                application: "A CAN controller triggers an interrupt on message receipt (Top Half). The message is placed in a ring buffer, and a workqueue (Bottom Half) is scheduled to parse and route the message."
            }
        ],
        resources: [
            { name: "Linux Device Drivers, 3rd Edition (LDD3)", url: "https://lwn.net/Kernel/LDD3/" },
            { name: "The Linux Kernel Module Programming Guide", url: "https://sysprog21.github.io/lkmpg/" }
        ]
    },
    'debian-packaging': {
        overview: "Debian packaging (`.deb`, `apt`) is a standard way to distribute, install, and update software on Debian-based Linux systems, managing dependencies automatically.",
        germanContext: "Siemens (SIMATIC Edge) and industrial automation companies often use Debian-based OS concepts for edge devices. Embedded DevOps engineers build CI/CD pipelines that compile binaries, package them into `.deb` files, and host local APT repositories for OTA (Over-The-Air) fleet updates.",
        subtopics: [
            {
                title: "Debian Control Files",
                theory: "The `debian/control` file defines the package metadata (Name, Version, Architecture, Maintainer) and its dependencies (`Depends`, `Breaks`, `Replaces`).",
                application: "Creating a `control` file for an edge gateway service that strictly depends on `libssl1.1` and `curl` to ensure the package won't install on an incompatible system."
            },
            {
                title: "Pre/Post Install Scripts (Maintainer Scripts)",
                theory: "`preinst`, `postinst`, `prerm`, `postrm` are bash scripts executed during the lifecycle of the package installation.",
                application: "A `postinst` script that enables and starts a systemd service (`systemctl enable my-service --now`) immediately after the binary is unpacked."
            }
        ],
        resources: [
            { name: "Debian New Maintainers' Guide", url: "https://www.debian.org/doc/manuals/maint-guide/" }
        ]
    },

    // --- PROTOCOLS & AUTO ---
    'autosar': {
        overview: "AUTOSAR (Automotive Open System Architecture) is a standardized software architecture for automotive ECUs. It decouples application software from the underlying hardware via a layered architecture.",
        germanContext: "Originated by German OEMs (BMW, Bosch, Continental, Daimler, VW). Knowing AUTOSAR Classic (for hard real-time) and Adaptive (for high-compute POSIX systems) is practically mandatory for getting high-paying automotive software jobs in Germany.",
        subtopics: [
            {
                title: "Classic AUTOSAR Architecture (BSW, RTE, SWC)",
                theory: "BSW (Basic Software) handles hardware and OS. SWC (Software Components) contain the application logic. The RTE (Runtime Environment) is the middleware that connects SWCs to each other and to the BSW.",
                application: "Configuring the RTE using DaVinci Configurator (Vector tool) so that a Brake Control SWC can read the wheel speed from the Sensor BSW without knowing the hardware address."
            },
            {
                title: "Adaptive AUTOSAR",
                theory: "A modern POSIX-based standard (often utilizing C++14) designed for high-performance computing (e.g., autonomous driving). Applications are deployed as distinct processes communicating via Service-Oriented Architecture (SOME/IP).",
                application: "Writing an Adaptive application in C++ that subscribes to a 'Camera Image' service over Ethernet using the ARA::COM API."
            }
        ],
        resources: [
            { name: "AUTOSAR Official Specifications", url: "https://www.autosar.org/" },
            { name: "Vector AUTOSAR e-Learning", url: "https://www.vector.com/int/en/know-how/autosar/" }
        ]
    },

    // --- DEVOPS ---
    'gitlab-ci': {
        overview: "GitLab CI/CD is a tool built into GitLab for software development using continuous methodologies. It relies on a YAML configuration file (`.gitlab-ci.yml`) to define pipelines.",
        germanContext: "GitLab is overwhelmingly the orchestrator of choice for on-premise, secure CI/CD in the German automotive/industrial sector (due to strict IP regulations keeping code off public clouds). Embedded DevOps rely on GitLab to trigger hardware-in-the-loop (HIL) tests.",
        subtopics: [
            {
                title: "Runners and Executors",
                theory: "A Runner is an isolated agent that executes the pipeline. Executors define *how* it runs (Shell, Docker, Kubernetes, VirtualBox).",
                application: "Configuring a 'Shell executor' on a dedicated build server connected to a physical HIL test rack, tagging it `hardware-rack-1`, so specific testing jobs are routed only to that machine."
            },
            {
                title: "Artifacts and Caching",
                theory: "Artifacts are files passed between stages (e.g., from Build to Test). Caching stores downloaded dependencies (e.g., Yocto `sstate-cache`) between pipeline runs to speed up execution.",
                application: "Mounting the Yocto `/downloads` directory as a Docker volume and caching the BitBake output, reducing an Embedded Linux build time from 4 hours to 10 minutes."
            }
        ],
        resources: [
            { name: "GitLab CI/CD Documentation", url: "https://docs.gitlab.com/ee/ci/" }
        ]
    },
    'cmake-vs-autotools': {
        overview: "Build systems orchestrate the compilation of source code into binaries. Autotools (Makefiles, configure) is the legacy standard, while Modern CMake (target-based) is the current industry standard.",
        germanContext: "German companies have massive legacy codebases (10-20 years old) built on Autotools or raw Makefiles. A highly sought-after Embedded DevOps skill is migrating these monoliths to Modern CMake to speed up builds and improve IDE (CLion/VSCode) integration.",
        subtopics: [
            {
                title: "Modern CMake (Target-Based)",
                theory: "Modern CMake revolves around `Targets` (executables/libraries) and `Properties` (include directories, compile definitions). `target_link_libraries` transitively propagates dependencies.",
                application: "Refactoring a project to use `target_include_directories(mylib PUBLIC include)` so that any executable linking `mylib` automatically gets the correct header paths."
            },
            {
                title: "Cross-Compilation with Toolchain Files",
                theory: "A toolchain file (`.cmake`) tells CMake about the target environment (e.g., ARM Cortex-M architecture), paths to the cross-compiler (`arm-none-eabi-gcc`), and sysroot.",
                application: "Invoking `cmake -DCMAKE_TOOLCHAIN_FILE=arm_toolchain.cmake ..` in a CI/CD pipeline inside a Docker container to produce a firmware `.bin` for an Infineon Aurix microcontroller."
            }
        ],
        resources: [
            { name: "Effective Modern CMake", url: "https://gist.github.com/mbinna/c61dbb39bca0e4fb7d1f73b0d66a4fd1" },
            { name: "CMake Tutorial", url: "https://cmake.org/cmake/help/latest/guide/tutorial/index.html" }
        ]
    }
};

// Fallback logic for topics not explicitly detailed above
export const getTopicContent = (slug: string) => {
    if (TOPIC_CONTENT[slug]) return TOPIC_CONTENT[slug];

    // Default placeholder for missing content
    return {
        overview: "Detailed curriculum content for this specific topic is currently under development. The core focus will include the theoretical underpinnings, hardware/software interactions, and CI/CD pipelines relevant to this area.",
        germanContext: "German automotive and industrial manufacturers maintain strict quality standards regarding this technology, utilizing it extensively in safety-critical edge environments and automated manufacturing.",
        subtopics: [
            {
                title: "Core Mechanics and Theory",
                theory: "In embedded software and DevOps, understanding the low-level mechanics of execution, memory, and orchestration is critical. This topic covers the foundation of those mechanics.",
                application: "Applied in creating determinisitic, highly-available systems capable of OTA updates and continuous monitoring via modern observability stacks."
            }
        ],
        resources: [
            { name: "Embedded Systems Development (General Reference)", url: "#" }
        ]
    };
};
