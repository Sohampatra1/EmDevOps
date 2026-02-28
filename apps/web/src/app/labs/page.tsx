'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Wrench, FileCode, Container, Server, Settings, GitBranch, Cloud, Layers } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const LABS = [
    {
        id: 'gitlab-ci', name: 'GitLab CI YAML Builder', icon: GitBranch, color: '#f97316',
        description: 'Build GitLab CI pipelines for embedded firmware projects',
        template: `stages:\n  - build\n  - test\n  - deploy\n\nbuild_firmware:\n  stage: build\n  image: arm-cross-compiler:latest\n  script:\n    - mkdir build && cd build\n    - cmake -DCMAKE_TOOLCHAIN_FILE=../toolchain-arm.cmake ..\n    - make -j$(nproc)\n  artifacts:\n    paths:\n      - build/firmware.bin\n    expire_in: 1 week\n\nunit_tests:\n  stage: test\n  image: gcc:latest\n  script:\n    - mkdir build && cd build\n    - cmake -DBUILD_TESTS=ON ..\n    - make -j$(nproc)\n    - ctest --output-on-failure\n\nhil_test:\n  stage: test\n  tags:\n    - hil-runner\n  script:\n    - python3 scripts/flash_dut.py build/firmware.bin\n    - python3 scripts/run_hil_tests.py\n  when: manual\n\ndeploy_staging:\n  stage: deploy\n  script:\n    - aws s3 cp build/firmware.bin s3://firmware-staging/\n  only:\n    - develop`
    },
    {
        id: 'azure-devops', name: 'Azure DevOps YAML Simulator', icon: Cloud, color: '#3b82f6',
        description: 'Create Azure DevOps pipelines with build agents and test plans',
        template: `trigger:\n  branches:\n    include:\n      - main\n      - develop\n\npool:\n  vmImage: 'ubuntu-latest'\n\nvariables:\n  buildConfiguration: 'Release'\n  targetPlatform: 'arm-cortex-m4'\n\nstages:\n- stage: Build\n  displayName: 'Build Firmware'\n  jobs:\n  - job: CrossCompile\n    displayName: 'Cross-compile for ARM'\n    steps:\n    - task: UsePythonVersion@0\n      inputs:\n        versionSpec: '3.9'\n    - script: |\n        sudo apt-get install -y gcc-arm-none-eabi\n        mkdir build && cd build\n        cmake -DCMAKE_BUILD_TYPE=$(buildConfiguration) ..\n        make -j$(nproc)\n      displayName: 'Build'\n    - publish: build/firmware.bin\n      artifact: firmware\n\n- stage: Test\n  displayName: 'Run Tests'\n  dependsOn: Build\n  jobs:\n  - job: UnitTests\n    steps:\n    - script: |\n        cd build && ctest --output-on-failure\n      displayName: 'Unit Tests'\n\n- stage: Deploy\n  displayName: 'Deploy to IoT Hub'\n  dependsOn: Test\n  condition: succeeded()\n  jobs:\n  - deployment: DeployFirmware\n    environment: staging\n    strategy:\n      runOnce:\n        deploy:\n          steps:\n          - script: |\n              az iot hub invoke-device-method --hub-name $(iotHubName) --device-id $(deviceId) --method-name firmwareUpdate`
    },
    {
        id: 'dockerfile', name: 'Dockerfile Builder', icon: Container, color: '#06b6d4',
        description: 'Build Docker images for cross-compilation environments',
        template: `# Multi-stage Dockerfile for ARM cross-compilation\n# Stage 1: Build environment\nFROM ubuntu:22.04 AS builder\n\n# Avoid interactive prompts\nENV DEBIAN_FRONTEND=noninteractive\n\n# Install cross-compilation toolchain\nRUN apt-get update && apt-get install -y \\\\\n    gcc-arm-linux-gnueabihf \\\\\n    g++-arm-linux-gnueabihf \\\\\n    cmake \\\\\n    make \\\\\n    git \\\\\n    wget \\\\\n    && rm -rf /var/lib/apt/lists/*\n\n# Set up cross-compilation environment\nENV CC=arm-linux-gnueabihf-gcc\nENV CXX=arm-linux-gnueabihf-g++\nENV CROSS_COMPILE=arm-linux-gnueabihf-\n\n# Copy source code\nWORKDIR /app\nCOPY . .\n\n# Build the project\nRUN mkdir build && cd build && \\\\\n    cmake -DCMAKE_TOOLCHAIN_FILE=../cmake/toolchain-arm.cmake \\\\\n          -DCMAKE_BUILD_TYPE=Release .. && \\\\\n    make -j$(nproc)\n\n# Stage 2: Minimal runtime image\nFROM arm32v7/debian:bullseye-slim\n\nCOPY --from=builder /app/build/firmware /usr/local/bin/\nCOPY --from=builder /app/config/ /etc/firmware/\n\nENTRYPOINT ["/usr/local/bin/firmware"]`
    },
    {
        id: 'systemd', name: 'systemd Service Generator', icon: Server, color: '#8b5cf6',
        description: 'Create systemd unit files for embedded Linux services',
        template: `[Unit]\nDescription=Sensor Data Collection Service\nAfter=network.target can-interface.service\nRequires=can-interface.service\nWants=multi-user.target\n\n[Service]\nType=simple\nExecStartPre=/usr/bin/check_hardware.sh\nExecStart=/usr/local/bin/sensor-collector --config /etc/sensor-collector/config.yaml\nExecReload=/bin/kill -HUP $MAINPID\nRestart=always\nRestartSec=5\nWatchdogSec=30\n\n# Security hardening\nUser=sensor-svc\nGroup=sensor-svc\nNoNewPrivileges=true\nProtectSystem=strict\nProtectHome=true\nReadWritePaths=/var/lib/sensor-data\nPrivateTmp=true\n\n# Resource limits\nMemoryMax=64M\nCPUQuota=25%\n\n# Environment\nEnvironmentFile=/etc/sensor-collector/env\n\n[Install]\nWantedBy=multi-user.target`
    },
    {
        id: 'cmake', name: 'CMake vs Autotools Comparison', icon: Settings, color: '#10b981',
        description: 'Side-by-side comparison of CMake and Autotools for embedded projects',
        template: `# ==========================================\n# MODERN CMAKE (CMakeLists.txt)\n# ==========================================\ncmake_minimum_required(VERSION 3.16)\nproject(EmbeddedFirmware VERSION 1.0.0 LANGUAGES C CXX)\n\nset(CMAKE_C_STANDARD 11)\nset(CMAKE_CXX_STANDARD 17)\n\n# Cross-compilation toolchain\nif(DEFINED CMAKE_TOOLCHAIN_FILE)\n  message(STATUS "Using toolchain: \${CMAKE_TOOLCHAIN_FILE}")\nendif()\n\n# Library target\nadd_library(hal STATIC\n  src/hal/gpio.c\n  src/hal/spi.c\n  src/hal/can.c\n)\ntarget_include_directories(hal PUBLIC include/)\n\n# Main firmware target\nadd_executable(firmware src/main.c)\ntarget_link_libraries(firmware PRIVATE hal)\n\n# Testing with CTest\nenable_testing()\nadd_subdirectory(tests)\n\n# Install rules\ninstall(TARGETS firmware DESTINATION bin)\ninstall(FILES config/default.conf DESTINATION etc/firmware)\n\n# CPack packaging\nset(CPACK_GENERATOR "DEB")\nset(CPACK_DEBIAN_PACKAGE_DEPENDS "libc6")\ninclude(CPack)\n\n# ==========================================\n# AUTOTOOLS (configure.ac + Makefile.am)\n# ==========================================\n# configure.ac:\n# AC_INIT([EmbeddedFirmware], [1.0.0])\n# AM_INIT_AUTOMAKE([foreign subdir-objects])\n# AC_PROG_CC\n# AC_PROG_CXX\n# AC_CONFIG_FILES([Makefile src/Makefile])\n# AC_OUTPUT\n#\n# Makefile.am:\n# bin_PROGRAMS = firmware\n# firmware_SOURCES = src/main.c\n# firmware_LDADD = libhal.a\n# \n# noinst_LIBRARIES = libhal.a\n# libhal_a_SOURCES = src/hal/gpio.c src/hal/spi.c`
    },
    {
        id: 'hil-arch', name: 'HIL Architecture Visualizer', icon: Layers, color: '#f43f5e',
        description: 'Visualize Hardware-in-the-Loop test infrastructure architecture',
        template: `# HIL Test Infrastructure Architecture\n# =====================================\n#\n# ┌──────────────── CI/CD Server ────────────────┐\n# │  GitLab Runner / Azure Agent                  │\n# │  ┌─────────────┐    ┌─────────────────────┐  │\n# │  │ Test Script  │───▶│ HIL Control Software │  │\n# │  │ (Python)     │    │ (dSPACE ControlDesk) │  │\n# │  └─────────────┘    └──────────┬──────────┘  │\n# └────────────────────────────────┼──────────────┘\n#                                  │\n#           ┌──────────────────────┼──────────────┐\n#           │    HIL Test Rack     │              │\n#           │  ┌──────────┐  ┌────▼─────┐        │\n#           │  │  Power    │  │ dSPACE   │        │\n#           │  │  Supply   │  │ Simulator│        │\n#           │  │  Unit     │  │ (MicroAutoBox) │  │\n#           │  └─────┬────┘  └────┬─────┘        │\n#           │        │            │               │\n#           │  ┌─────▼────────────▼─────┐        │\n#           │  │     DUT (ECU)          │        │\n#           │  │  ┌────┐  ┌────┐       │        │\n#           │  │  │CAN │  │GPIO│       │        │\n#           │  │  │Bus │  │    │       │        │\n#           │  │  └──┬─┘  └──┬─┘       │        │\n#           │  └─────┼───────┼─────────┘        │\n#           │        │       │                   │\n#           │  ┌─────▼───────▼─────┐             │\n#           │  │  Vector VN1640    │             │\n#           │  │  (CAN Interface)  │             │\n#           │  └──────────────────┘             │\n#           └───────────────────────────────────┘\n#\n# Key Components:\n# - CI/CD Server: Triggers tests on git push\n# - HIL Control: dSPACE ControlDesk / NI VeriStand\n# - Simulator: Simulates vehicle environment\n# - DUT: Device Under Test (actual ECU)\n# - CAN Interface: Vector VN1640/1610\n# - Test Results: JUnit XML → CI dashboard`
    },
    {
        id: 'iot-arch', name: 'IoT Architecture Builder', icon: Cloud, color: '#eab308',
        description: 'Design Azure IoT Hub and AWS IoT Core architectures for embedded devices',
        template: `# Azure IoT Hub Architecture\n# ==========================\n#\n# ┌─────────────────────────────────────────────┐\n# │              Azure Cloud                     │\n# │  ┌──────────────────────────────────────┐   │\n# │  │         Azure IoT Hub                │   │\n# │  │  ┌──────────┐  ┌───────────────┐    │   │\n# │  │  │ Device   │  │ Message       │    │   │\n# │  │  │ Registry │  │ Routing       │    │   │\n# │  │  └──────────┘  └───────┬───────┘    │   │\n# │  └─────────────────────────┼────────────┘   │\n# │                            │                 │\n# │  ┌────────────────┐  ┌────▼──────┐          │\n# │  │ Azure Stream   │  │ Azure     │          │\n# │  │ Analytics      │  │ Functions │          │\n# │  └────────┬───────┘  └────┬──────┘          │\n# │           │               │                  │\n# │  ┌────────▼───────────────▼──────┐          │\n# │  │     Azure Cosmos DB /         │          │\n# │  │     Blob Storage              │          │\n# │  └──────────────────────────────┘          │\n# └─────────────────────────────────────────────┘\n#             │ MQTT/AMQP\n# ┌───────────▼───────────────────────────────┐\n# │           IoT Edge Gateway                 │\n# │  ┌──────────┐  ┌────────────────────┐     │\n# │  │ Edge     │  │ Custom Modules     │     │\n# │  │ Runtime  │  │ (Sensor Processing)│     │\n# │  └──────────┘  └────────────────────┘     │\n# └─────────────────────────────────────────────┘\n#             │\n# ┌───────────▼───────────────────────────────┐\n# │        Embedded Devices                    │\n# │  ┌──────┐  ┌──────┐  ┌──────┐           │\n# │  │ ECU  │  │Sensor│  │ MCU  │           │\n# │  │      │  │ Node │  │      │           │\n# │  └──────┘  └──────┘  └──────┘           │\n# └───────────────────────────────────────────┘`
    },
]

export default function LabsPage() {
    const [activeLab, setActiveLab] = useState<typeof LABS[0] | null>(null)
    const [code, setCode] = useState('')

    const openLab = (lab: typeof LABS[0]) => {
        setActiveLab(lab)
        setCode(lab.template)
    }

    if (activeLab) {
        return (
            <div className="space-y-4 -m-6">
                <div className="flex items-center justify-between px-6 py-3 bg-[var(--bg-secondary)] border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveLab(null)} className="btn-secondary py-2 px-3">
                            ← Back
                        </button>
                        <activeLab.icon size={18} style={{ color: activeLab.color }} />
                        <span className="font-medium">{activeLab.name}</span>
                    </div>
                    <button className="btn-primary py-2">
                        <FileCode size={14} /> Copy YAML
                    </button>
                </div>
                <div className="px-0 h-[calc(100vh-60px)]">
                    <MonacoEditor
                        height="100%"
                        language={activeLab.id.includes('docker') ? 'dockerfile' : 'yaml'}
                        theme="vs-dark"
                        value={code}
                        onChange={(v) => setCode(v || '')}
                        options={{
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', monospace",
                            minimap: { enabled: false },
                            padding: { top: 16 },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                        }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold gradient-text">Practical Labs</h1>
                <p className="text-[var(--text-secondary)] mt-1">Interactive builders for DevOps tools used in German embedded companies</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LABS.map((lab, i) => (
                    <motion.div
                        key={lab.id}
                        className="glass-card p-5 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        onClick={() => openLab(lab)}
                        whileHover={{ scale: 1.02 }}
                    >
                        <lab.icon size={24} style={{ color: lab.color }} className="mb-3" />
                        <h3 className="font-semibold mb-1">{lab.name}</h3>
                        <p className="text-xs text-[var(--text-secondary)]">{lab.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
