import React, { useState } from 'react';
import { ArrowLeft, Search, Pill, AlertTriangle, FileText, Activity, Info, ExternalLink, Sparkles, Zap } from 'lucide-react';
import { drugAIService } from '../../services/drugAI';
import type { DrugAIInsights } from '../../services/drugAI';

interface MediCareProps {
    onBack: () => void;
}

interface DrugInfo {
    brand_name: string;
    usage: string[];
    side_effects: string[];
}

export const MediCare: React.FC<MediCareProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);

    // AI Enhancement States
    const [useAI, setUseAI] = useState(false);
    const [aiInsights, setAiInsights] = useState<DrugAIInsights | null>(null);
    const [isAIProcessing, setIsAIProcessing] = useState(false);

    const formatTextToPoints = (text: string): string[] => {
        if (!text) return ["No information available."];
        // Split by periods or newlines, filter empty strings, and trim
        return text.split(/[.\n]+/)
            .map(line => line.trim())
            .filter(line => line.length > 3); // Filter out very short segments
    };

    const fetchDrugInfo = async (medicineName: string) => {
        if (!medicineName.trim()) return;

        setLoading(true);
        setDrugInfo(null);
        setAiInsights(null);

        try {
            let searchName = medicineName;

            // Step 1: Try local dictionary first (instant)
            const drugNameMap: { [key: string]: string } = {
                // Pain & Fever
                'paracetamol': 'acetaminophen',
                'panadol': 'acetaminophen',
                'calpol': 'acetaminophen',
                'crocin': 'acetaminophen',
                'dolo': 'acetaminophen',
                'tylenol': 'acetaminophen',

                // Antibiotics
                'amoxycillin': 'amoxicillin',
                'augmentin': 'amoxicillin',
                'azithral': 'azithromycin',
                'zithromax': 'azithromycin',
                'ciprofloxacin': 'ciprofloxacin',
                'cipro': 'ciprofloxacin',

                // Respiratory
                'salbutamol': 'albuterol',
                'ventolin': 'albuterol',
                'asthalin': 'albuterol',
                'levolin': 'levosalbutamol',
                'montelukast': 'montelukast',
                'singulair': 'montelukast',

                // Cardiovascular
                'adrenaline': 'epinephrine',
                'noradrenaline': 'norepinephrine',
                'isoprenaline': 'isoproterenol',
                'lignocaine': 'lidocaine',
                'xylocaine': 'lidocaine',
                'glyceryl trinitrate': 'nitroglycerin',
                'sorbitrate': 'isosorbide',
                'atenolol': 'atenolol',
                'metoprolol': 'metoprolol',
                'amlodipine': 'amlodipine',
                'norvasc': 'amlodipine',

                // Diuretics
                'frusemide': 'furosemide',
                'lasix': 'furosemide',
                'torsemide': 'torsemide',

                // Diabetes
                'metformin': 'metformin',
                'glucophage': 'metformin',
                'glimepiride': 'glimepiride',
                'amaryl': 'glimepiride',
                'insulin': 'insulin',

                // Gastric
                'omeprazole': 'omeprazole',
                'prilosec': 'omeprazole',
                'pantoprazole': 'pantoprazole',
                'protonix': 'pantoprazole',
                'ranitidine': 'ranitidine',
                'zantac': 'ranitidine',

                // Anti-inflammatory
                'diclofenac': 'diclofenac',
                'voltaren': 'diclofenac',
                'ibuprofen': 'ibuprofen',
                'advil': 'ibuprofen',
                'motrin': 'ibuprofen',
                'naproxen': 'naproxen',
                'aleve': 'naproxen',

                // Antihistamines
                'cetirizine': 'cetirizine',
                'zyrtec': 'cetirizine',
                'loratadine': 'loratadine',
                'claritin': 'loratadine',
                'fexofenadine': 'fexofenadine',
                'allegra': 'fexofenadine',

                // Others
                'prednisolone': 'prednisolone',
                'prednisone': 'prednisone',
                'dexamethasone': 'dexamethasone',
                'aspirin': 'aspirin',
                'warfarin': 'warfarin',
                'coumadin': 'warfarin',
                'clopidogrel': 'clopidogrel',
                'plavix': 'clopidogrel'
            };

            const lowerName = medicineName.toLowerCase().trim();
            if (drugNameMap[lowerName]) {
                searchName = drugNameMap[lowerName];
                console.log(`📚 Dictionary translated "${medicineName}" to "${searchName}"`);
            }
            // Step 2: If AI is enabled and no dictionary match, use AI translation
            else if (useAI) {
                try {
                    const translatedName = await translateDrugName(medicineName);
                    if (translatedName && translatedName.toLowerCase() !== medicineName.toLowerCase()) {
                        searchName = translatedName;
                        console.log(`🤖 AI translated "${medicineName}" to "${searchName}"`);
                    }
                } catch (aiError) {
                    console.warn('AI translation failed, using original name:', aiError);
                }
            }

            const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${searchName}"+openfda.generic_name:"${searchName}"&limit=1`);

            console.log('FDA API Response Status:', response.status);

            if (!response.ok) {
                throw new Error('Medicine not found or API error');
            }

            const data = await response.json();
            console.log('FDA API Data:', data);

            if (!data.results || data.results.length === 0) {
                throw new Error('No information available for this medicine');
            }

            const result = data.results[0];
            const rawUsage = result.indications_and_usage?.[0] || "";
            const rawSideEffects = result.adverse_reactions?.[0] || "";

            console.log('Raw Usage:', rawUsage);
            console.log('Raw Side Effects:', rawSideEffects);

            const info: DrugInfo = {
                brand_name: result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || searchName,
                usage: formatTextToPoints(rawUsage),
                side_effects: formatTextToPoints(rawSideEffects)
            };

            console.log('Formatted Info:', info);

            setDrugInfo(info);

            // Call AI if enabled
            if (useAI) {
                setIsAIProcessing(true);
                try {
                    const aiAnalysis = await drugAIService.analyzeDrugInformation(
                        info.brand_name,
                        info.usage,
                        info.side_effects
                    );
                    setAiInsights(aiAnalysis);
                } catch (aiError) {
                    console.error('AI analysis failed:', aiError);
                } finally {
                    setIsAIProcessing(false);
                }
            }

        } catch (err: any) {
            // Provide helpful suggestions for common international drug names
            const suggestions: { [key: string]: string } = {
                'paracetamol': 'acetaminophen',
                'panadol': 'acetaminophen',
                'calpol': 'acetaminophen',
                'salbutamol': 'albuterol',
                'adrenaline': 'epinephrine',
                'noradrenaline': 'norepinephrine'
            };

            const lowerMedicine = medicineName.toLowerCase();
            const suggestion = suggestions[lowerMedicine];

            setDrugInfo({
                brand_name: medicineName,
                usage: suggestion
                    ? [`Medicine not found in FDA database. Try searching for "${suggestion}" (US name for ${medicineName}).`, useAI ? "Tip: AI mode is ON but couldn't find this drug. The AI translator works best with common medications." : "Tip: Enable AI mode for automatic drug name translation!"]
                    : ["Medicine not found in FDA database. Please try the US brand name or generic name (e.g., 'Tylenol' or 'Acetaminophen' instead of 'Paracetamol').", useAI ? "AI mode is ON but couldn't translate this drug name." : "Tip: Enable AI mode for automatic drug name translation!"],
                side_effects: ["No information available."]
            });
        } finally {
            setLoading(false);
        }
    };

    // AI-powered drug name translation
    const translateDrugName = async (drugName: string): Promise<string> => {
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        const genAI = new (await import("@google/generative-ai")).GoogleGenerativeAI(API_KEY);

        const prompt = `You are a pharmaceutical expert. Convert this drug name to its US FDA-approved generic or brand name.

Drug name: "${drugName}"

Rules:
- If it's already a US name, return it unchanged
- If it's an international name (e.g., paracetamol), return the US equivalent (e.g., acetaminophen)
- Return ONLY the drug name, nothing else
- If unsure, return the original name

US drug name:`;

        try {
            // Use the same model selection as other services
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const translatedName = result.response.text().trim().replace(/['"]/g, '').toLowerCase();

            // Validate the response
            if (translatedName && translatedName.length > 0 && translatedName.length < 50) {
                return translatedName;
            }
            return drugName;
        } catch (error) {
            console.error('Translation error:', error);
            return drugName;
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchDrugInfo(searchTerm);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-900 via-emerald-900 to-teal-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Activity className="w-8 h-8 text-teal-400" />
                            MediCare
                        </h1>
                        <p className="text-teal-200">Instant Drug Information System</p>
                    </div>
                </div>

                {/* Search Box */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl mb-8">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter medicine name (e.g., Aspirin, Ibuprofen)"
                            className="w-full bg-black/20 border-2 border-white/10 rounded-xl py-4 pl-14 pr-4 text-lg focus:outline-none focus:border-teal-400 transition-colors placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>

                    {/* AI Mode Toggle */}
                    <div className="mt-6 flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                            {useAI ? (
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            ) : (
                                <Zap className="w-5 h-5 text-teal-400" />
                            )}
                            <div>
                                <p className="text-sm font-semibold text-white">
                                    {useAI ? 'AI-Enhanced Mode' : 'Standard Mode'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {useAI ? 'FDA Data + AI Insights & Recommendations' : 'FDA Data Only'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setUseAI(!useAI)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useAI ? 'bg-purple-600' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useAI ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Disclaimer Alert */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-yellow-500">Medical Disclaimer</h3>
                        <p className="text-yellow-200/80 text-sm mt-1">
                            This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
                            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                        </p>
                    </div>
                </div>

                {/* Results */}
                {drugInfo && (
                    <div className="animate-fade-in">
                        {/* Two Column Layout: FDA Info (Left) + AI Summary (Right Sidebar) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left Column: FDA Information */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2 text-teal-300">
                                            <Pill className="w-6 h-6" />
                                            {drugInfo.brand_name}
                                        </h2>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 bg-black/20 px-3 py-1 rounded-full">
                                            <Info className="w-3 h-3" />
                                            Source: openFDA
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-300">
                                                <FileText className="w-5 h-5" />
                                                Indications & Usage
                                            </h3>
                                            <ul className="space-y-3">
                                                {drugInfo.usage.map((point, index) => (
                                                    <li key={index} className="flex items-start gap-3 text-gray-200">
                                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                                        <span className="leading-relaxed">{point}.</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-300">
                                                <AlertTriangle className="w-5 h-5" />
                                                Side Effects & Adverse Reactions
                                            </h3>
                                            <ul className="space-y-3">
                                                {drugInfo.side_effects.map((point, index) => (
                                                    <li key={index} className="flex items-start gap-3 text-gray-200">
                                                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                                        <span className="leading-relaxed">{point}.</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                        <a
                                            href={`https://open.fda.gov/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
                                        >
                                            Verify data on openFDA <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: AI Summary Sidebar (Sticky with Scroll) */}
                            {useAI && aiInsights && (
                                <div className="lg:col-span-1">
                                    <div className="sticky top-6 space-y-4 max-h-[calc(100vh-3rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
                                        {/* AI Processing Indicator */}
                                        {isAIProcessing && (
                                            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4 flex items-center gap-3">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                                                <span className="text-purple-300 text-sm">AI analyzing...</span>
                                            </div>
                                        )}

                                        {/* AI Summary Card */}
                                        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-5 border border-purple-700/40">
                                            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-purple-300">
                                                <Sparkles className="w-4 h-4" />
                                                AI Quick Summary
                                            </h3>
                                            <p className="text-sm text-gray-200 leading-relaxed">{aiInsights.summary}</p>
                                        </div>

                                        {/* Common Uses */}
                                        {aiInsights.commonUses.length > 0 && (
                                            <div className="bg-black/20 rounded-xl p-5 border border-white/5">
                                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-300">
                                                    <Pill className="w-4 h-4" />
                                                    Common Uses
                                                </h3>
                                                <ul className="space-y-2">
                                                    {aiInsights.commonUses.map((use, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                                                            <span className="text-blue-400">•</span>
                                                            <span>{use}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Important Warnings */}
                                        {aiInsights.importantWarnings.length > 0 && (
                                            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-5">
                                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-300">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Warnings
                                                </h3>
                                                <ul className="space-y-2">
                                                    {aiInsights.importantWarnings.map((warning, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                                                            <span className="text-red-400">⚠</span>
                                                            <span>{warning}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Patient Advice */}
                                        {aiInsights.patientAdvice.length > 0 && (
                                            <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-5">
                                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-green-300">
                                                    <Info className="w-4 h-4" />
                                                    Quick Tips
                                                </h3>
                                                <ul className="space-y-2">
                                                    {aiInsights.patientAdvice.map((advice, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                                                            <span className="text-green-400">✓</span>
                                                            <span>{advice}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
