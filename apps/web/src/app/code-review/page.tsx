'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FlaskConical, Send, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const SAMPLE_CODES = [
    {
        title: 'Sensor Data Reader',
        language: 'c',
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_SENSORS 10
#define BUFFER_SIZE 256

typedef struct {
    int id;
    float value;
    char name[64];
} SensorData;

SensorData* sensors;
int sensor_count = 0;

void init_sensors() {
    sensors = malloc(sizeof(SensorData) * MAX_SENSORS);
    // No NULL check after malloc
}

float read_sensor(int id) {
    // No bounds checking
    return sensors[id].value;
}

void update_sensor(int id, float value) {
    sensors[id].value = value;
    char buffer[16];
    sprintf(buffer, "Sensor %d updated to %f", id, value);
    printf("%s\\n", buffer);
    // Buffer overflow: sprintf with potentially long float
}

void process_all_sensors() {
    for (int i = 0; i <= sensor_count; i++) {
        // Off-by-one error
        float val = read_sensor(i);
        if (val > 100.0) {
            printf("WARNING: Sensor %d critical!\\n", i);
        }
    }
}

int main() {
    init_sensors();
    sensor_count = 5;
    
    for (int i = 0; i < sensor_count; i++) {
        update_sensor(i, (float)(i * 25.5));
    }
    
    process_all_sensors();
    // Memory leak: sensors never freed
    return 0;
}`
    },
    {
        title: 'CAN Message Handler',
        language: 'cpp',
        code: `#include <cstdint>
#include <vector>
#include <map>

class CANMessage {
public:
    uint32_t id;
    uint8_t data[8];
    uint8_t dlc;
    
    CANMessage(uint32_t _id, uint8_t* _data, uint8_t _dlc) {
        id = _id;
        memcpy(data, _data, _dlc);
        dlc = _dlc;
    }
};

class CANHandler {
    std::map<uint32_t, void(*)(CANMessage&)> callbacks;
    CANMessage* lastMessage;
    
public:
    CANHandler() {
        lastMessage = nullptr;
    }
    
    void registerCallback(uint32_t id, void(*cb)(CANMessage&)) {
        callbacks[id] = cb;
    }
    
    void processMessage(uint32_t id, uint8_t* data, uint8_t dlc) {
        CANMessage msg(id, data, dlc);
        lastMessage = new CANMessage(id, data, dlc);
        // Memory leak: previous lastMessage not deleted
        
        auto it = callbacks.find(id);
        if (it != callbacks.end()) {
            it->second(msg);
        }
    }
    
    // Missing virtual destructor
    // Missing copy constructor and assignment operator
    // No const correctness on getters
    
    CANMessage* getLastMessage() {
        return lastMessage;
    }
};`
    }
]

interface ReviewResult {
    overallScore: number
    issues: Array<{ severity: string; line: number | null; message: string; category: string }>
    suggestions: string[]
    misraViolations: string[]
    memoryIssues: string[]
    positives: string[]
}

export default function CodeReviewPage() {
    const [code, setCode] = useState(SAMPLE_CODES[0].code)
    const [language, setLanguage] = useState(SAMPLE_CODES[0].language)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ReviewResult | null>(null)

    const loadSample = (sample: typeof SAMPLE_CODES[0]) => {
        setCode(sample.code)
        setLanguage(sample.language)
        setResult(null)
    }

    const submitReview = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/ai/code-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language })
            })
            const data = await res.json()
            setResult(data)
        } catch {
            setResult({ overallScore: 0, issues: [], suggestions: ['Service unavailable'], misraViolations: [], memoryIssues: [], positives: [] })
        }
        setLoading(false)
    }

    const severityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <AlertCircle size={12} className="text-rose-400" />
            case 'warning': return <AlertTriangle size={12} className="text-amber-400" />
            default: return <Info size={12} className="text-blue-400" />
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold gradient-text">Code Review Simulator</h1>
                <p className="text-[var(--text-secondary)] mt-1">AI simulates a senior German code reviewer — MISRA, memory safety, const correctness</p>
            </div>

            {/* Sample Selector */}
            <div className="flex gap-2">
                {SAMPLE_CODES.map((s, i) => (
                    <button key={i} onClick={() => loadSample(s)} className="btn-secondary py-2 text-xs">
                        {s.title} ({s.language.toUpperCase()})
                    </button>
                ))}
                <button onClick={submitReview} disabled={loading} className="btn-primary py-2 ml-auto">
                    <Send size={14} />
                    {loading ? 'Reviewing...' : 'Submit for Review'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Editor */}
                <div className="glass-card overflow-hidden" style={{ height: '600px' }}>
                    <div className="px-4 py-2 border-b border-white/[0.06] text-xs text-[var(--text-muted)]">
                        <FlaskConical size={12} className="inline mr-1" /> Code Editor — {language.toUpperCase()}
                    </div>
                    <MonacoEditor
                        height="calc(100% - 36px)"
                        language={language === 'cpp' ? 'cpp' : language}
                        theme="vs-dark"
                        value={code}
                        onChange={(v) => setCode(v || '')}
                        options={{
                            fontSize: 13,
                            fontFamily: "'JetBrains Mono', monospace",
                            minimap: { enabled: false },
                            padding: { top: 12 },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                        }}
                    />
                </div>

                {/* Review Results */}
                <div className="glass-card p-5 overflow-y-auto" style={{ maxHeight: '600px' }}>
                    {!result ? (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
                            <FlaskConical size={40} className="mb-3 opacity-30" />
                            <p className="text-sm">Submit your code for AI review</p>
                            <p className="text-xs mt-1">The AI will act as a senior reviewer at a German company</p>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {/* Score */}
                            <div className="text-center mb-4">
                                <div className="text-4xl font-black" style={{ color: result.overallScore >= 70 ? '#10b981' : result.overallScore >= 40 ? '#f59e0b' : '#f43f5e' }}>
                                    {result.overallScore}/100
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">Code Quality Score</div>
                            </div>

                            {/* Issues */}
                            {result.issues?.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">Issues Found</h4>
                                    <div className="space-y-2">
                                        {result.issues.map((issue, i) => (
                                            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                                                {severityIcon(issue.severity)}
                                                <div>
                                                    <span className="text-xs font-medium">{issue.category}</span>
                                                    {issue.line && <span className="text-[10px] text-[var(--text-muted)] ml-1">L{issue.line}</span>}
                                                    <p className="text-xs text-[var(--text-secondary)]">{issue.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* MISRA Violations */}
                            {result.misraViolations?.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-rose-400 uppercase mb-2">MISRA Violations</h4>
                                    <ul className="space-y-1">
                                        {result.misraViolations.map((v, i) => (
                                            <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                                                <AlertCircle size={10} className="text-rose-400 mt-0.5 shrink-0" /> {v}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Memory Issues */}
                            {result.memoryIssues?.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-amber-400 uppercase mb-2">Memory Issues</h4>
                                    <ul className="space-y-1">
                                        {result.memoryIssues.map((m, i) => (
                                            <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                                                <AlertTriangle size={10} className="text-amber-400 mt-0.5 shrink-0" /> {m}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Positives */}
                            {result.positives?.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-emerald-400 uppercase mb-2">Positives</h4>
                                    <ul className="space-y-1">
                                        {result.positives.map((p, i) => (
                                            <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                                                <CheckCircle2 size={10} className="text-emerald-400 mt-0.5 shrink-0" /> {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Suggestions */}
                            {result.suggestions?.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-cyan-400 uppercase mb-2">Suggestions</h4>
                                    <ul className="space-y-1">
                                        {result.suggestions.map((s, i) => (
                                            <li key={i} className="text-xs text-[var(--text-secondary)]">• {s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
