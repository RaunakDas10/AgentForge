import React, { useState } from 'react';
import { ArrowLeft, Search, Pill, AlertTriangle, FileText, Activity, Info, ExternalLink } from 'lucide-react';

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

        try {
            const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${medicineName}"+openfda.generic_name:"${medicineName}"&limit=1`);

            if (!response.ok) {
                throw new Error('Medicine not found or API error');
            }

            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                throw new Error('No information available for this medicine');
            }

            const result = data.results[0];
            const rawUsage = result.indications_and_usage?.[0] || "";
            const rawSideEffects = result.adverse_reactions?.[0] || "";

            const info: DrugInfo = {
                brand_name: result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || medicineName,
                usage: formatTextToPoints(rawUsage),
                side_effects: formatTextToPoints(rawSideEffects)
            };

            setDrugInfo(info);

        } catch (err: any) {
            setDrugInfo({
                brand_name: medicineName,
                usage: ["No information available."],
                side_effects: ["No information available."]
            });
        } finally {
            setLoading(false);
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
                    <div className="space-y-6 animate-fade-in">
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
                )}
            </div>
        </div>
    );
};
