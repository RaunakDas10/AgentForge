
// import React, { useState } from 'react';
// import { ArrowLeft, Play, Loader2, FileText } from 'lucide-react';
// import { ThinkingTerminal, type LogStep } from '../../components/agent/ThinkingTerminal';
// import { agentService } from '../../services/agentService';

// interface NewsSummarizerProps {
//     onBack: () => void;
// }

// export const NewsSummarizer: React.FC<NewsSummarizerProps> = ({ onBack }) => {
//     const [topics, setTopics] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [result, setResult] = useState<any>(null);
//     const [error, setError] = useState<string | null>(null);
//     const [logs, setLogs] = useState<LogStep[]>([]);

//     const addLog = (message: string, type: LogStep['type'] = 'info') => {
//         setLogs(prev => [...prev, {
//             id: Math.random().toString(36).substr(2, 9),
//             message,
//             type,
//             timestamp: Date.now()
//         }]);
//     };

//     const handleRun = async () => {
//         setLoading(true);
//         setError(null);
//         setResult(null);
//         setLogs([]);

//         try {
//             if (!topics) throw new Error('Please enter topics');

//             addLog("Initializing News Summarizer...", 'info');
//             await new Promise(r => setTimeout(r, 600));

//             addLog(`Searching for latest news on: ${topics}`, 'tool');
//             await new Promise(r => setTimeout(r, 800));

//             addLog("Aggregating articles...", 'analysis');

//             const prompt = `Execute the agent task: News Summarizer.\nDescription: Daily news digest with AI-powered summaries.\n\nInputs:\n- Topics: ${topics}`;
//             const response = await agentService.executeAdHoc(prompt);

//             const rawOutput = response.data.output;
//             const finalOutput = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput, null, 2);

//             setResult({
//                 status: 'success',
//                 message: 'News summary generated!',
//                 data: { output: finalOutput, timestamp: new Date().toISOString() }
//             });
//             addLog("Summary complete.", 'success');

//         } catch (err: any) {
//             setError(err.message || 'Error occurred');
//             addLog(`Error: ${err.message}`, 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
//             <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
//                 <div className="max-w-4xl mx-auto px-6 py-4">
//                     <div className="flex items-center gap-4">
//                         <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
//                             <ArrowLeft className="w-5 h-5 text-slate-400" />
//                         </button>
//                         <div className="p-2 rounded-lg bg-yellow-500/20">
//                             <FileText className="w-6 h-6 text-yellow-400" />
//                         </div>
//                         <div>
//                             <h1 className="text-xl font-bold">News Summarizer</h1>
//                             <p className="text-sm text-slate-400">Content</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-4xl mx-auto px-6 py-12">
//                 <div className="grid md:grid-cols-3 gap-8">
//                     <div className="md:col-span-2 space-y-8">
//                         <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
//                             <h2 className="text-xl font-bold mb-4">Configure Agent</h2>
//                             <p className="text-gray-400 mb-8">Daily news digest with AI-powered summaries.</p>

//                             <div className="space-y-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-2">Topics <span className="text-pink-500">*</span></label>
//                                     <input
//                                         type="text"
//                                         placeholder="AI, Tech, Finance"
//                                         className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-600"
//                                         value={topics}
//                                         onChange={(e) => setTopics(e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="mt-8 pt-8 border-t border-white/10">
//                                 <button
//                                     onClick={handleRun}
//                                     disabled={loading}
//                                     className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-yellow-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <Loader2 className="w-5 h-5 animate-spin" />
//                                             Summarizing...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Play className="w-5 h-5" />
//                                             Get News
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>

//                         {(loading || logs.length > 0) && <ThinkingTerminal logs={logs} isVisible={true} />}
//                         {(result || error) && (
//                             <div className={`rounded-xl border p-6 ${error ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
//                                 <h3 className={`font-bold mb-2 ${error ? 'text-red-400' : 'text-green-400'}`}>{error ? 'Failed' : 'Success'}</h3>
//                                 {result && <div className="text-sm whitespace-pre-wrap">{result.data.output}</div>}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


//NOTE-1 :- You can change design except the const handleExecuteFetch function
//NOTE-2 :- Currently using the US based en news fetching can be targeted to India by IN -be careful in changing
// - Saikat

import React, { useState } from 'react';
import { ArrowLeft, Loader2, ExternalLink, Cpu, Briefcase, Trophy, FlaskConical, Image as ImageIcon, Zap, Utensils } from 'lucide-react';
import { ThinkingTerminal, type LogStep } from '../../components/agent/ThinkingTerminal';

interface NewsItem {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    thumbnail: string;
    source: string;
}

const CATEGORIES = [
    { id: 'top', label: 'TOP NEWS', icon: <Zap className="w-3.5 h-3.5" />, query: 'latest' },
    { id: 'tech', label: 'TECH', icon: <Cpu className="w-3.5 h-3.5" />, query: 'Technology' },
    { id: 'business', label: 'BUSINESS', icon: <Briefcase className="w-3.5 h-3.5" />, query: 'Business' },
    { id: 'sports', label: 'SPORTS', icon: <Trophy className="w-3.5 h-3.5" />, query: 'Sports' },
    { id: 'science', label: 'SCIENCE', icon: <FlaskConical className="w-3.5 h-3.5" />, query: 'Science' },
    { id: 'entertainment', label: 'ENTERTAINMENT', icon: <ImageIcon className="w-3.5 h-3.5" />, query: 'Entertainment' },
];

const REGIONS = [
    { id: 'india', label: 'INDIA', code: 'IN', lang: 'en-IN' },
    { id: 'world', label: 'WORLD', code: 'US', lang: 'en-US' },
];

const NewsSummarizer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selected, setSelected] = useState(CATEGORIES[0]);
    const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState<NewsItem[]>([]);
    const [logs, setLogs] = useState<LogStep[]>([]);

    const addLog = (message: string, type: LogStep['type'] = 'info') => {
        setLogs(prev => [...prev, {
            id: Math.random().toString(36).substring(2, 9),
            message,
            type,
            timestamp: Date.now()
        }]);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleExecuteFetch = async () => {
        setLoading(true);
        setArticles([]);
        setLogs([]);

        try {
            addLog("🍳 Gathering raw data ingredients...", "info");
            await sleep(600);
            addLog(`🔥 Preheating stream for [${selected.label}] in [${selectedRegion.label}]...`, "info");

            // Calculate date 3 days ago for filtering
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

            // Build query with time filter for recent news
            const query = selected.id === 'top'
                ? `breaking news when:3d`
                : `${selected.query} when:3d`;

            // Use proper Google News RSS with region-specific settings
            const rssUrl = selectedRegion.id === 'india'
                ? `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`
                : `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

            addLog(`🔍 Searching: "${query}" in ${selectedRegion.label}...`, "tool");

            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            const data = await response.json();

            addLog("🔪 Slicing and dicing metadata...", "analysis");
            await sleep(500);
            addLog("🥘 Filtering last 3 days news only...", "info");
            await sleep(400);
            addLog("🧂 Extracting source information and thumbnails...", "tool");

            // Filter and process only recent articles (last 3 days)
            const recentArticles = data.items.filter((item: any) => {
                const articleDate = new Date(item.pubDate);
                return articleDate >= threeDaysAgo;
            });

            const fetched = recentArticles.slice(0, 8).map((item: any) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(item.description, 'text/html');
                const imgTag = doc.querySelector('img');
                let imgUrl = imgTag ? imgTag.getAttribute('src') : null;
                if (imgUrl && imgUrl.startsWith('//')) imgUrl = `https:${imgUrl}`;

                // Extract source from title (usually in format "Title - Source")
                const titleParts = item.title.split(' - ');
                const source = titleParts.length > 1 ? titleParts[titleParts.length - 1] : 'Google News';

                return {
                    title: item.title,
                    description: doc.body.textContent?.split('View Full Coverage')[0] || item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    thumbnail: imgUrl || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400`,
                    source: source
                };
            });

            await sleep(800);
            addLog(`🍽️ Serving ${fetched.length} fresh headlines from last 3 days in ${selectedRegion.label}!`, "success");
            setArticles(fetched);
        } catch (err) {
            addLog("🧨 Kitchen failure: Signal lost.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans p-6 md:p-12 selection:bg-orange-500/30">
            <div className="max-w-[1400px] mx-auto">

                {/* --- HEADER --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
                    <div className="space-y-4">
                        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-500 hover:text-orange-500 transition-colors uppercase">
                            <ArrowLeft className="w-3 h-3" />
                            System_Back
                        </button>
                        <h1 className="text-6xl font-bold tracking-tight text-white leading-none">
                            News<span className="text-orange-500">Chef</span>
                        </h1>
                        <p className="text-slate-500 text-sm">Real-time news from {selectedRegion.label}</p>
                    </div>

                    <div className="space-y-4 w-full lg:w-auto">
                        {/* Region Toggle */}
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full lg:w-auto">
                            {REGIONS.map((region) => (
                                <button
                                    key={region.id}
                                    onClick={() => setSelectedRegion(region)}
                                    className={`flex-1 lg:flex-none px-8 py-2.5 rounded-lg text-[11px] font-bold transition-all ${selectedRegion.id === region.id
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20'
                                        : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {region.label}
                                </button>
                            ))}
                        </div>

                        {/* Category Tabs */}
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelected(cat)}
                                    className={`px-4 lg:px-6 py-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 whitespace-nowrap ${selected.id === cat.id
                                        ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                                        : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-start">

                    <div className="lg:col-span-5 lg:sticky lg:top-10 space-y-6">
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Utensils className="text-orange-500 w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Kitchen_Monitor.exe</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                </div>
                            </div>

                            {/* Fixed internal scroll fixed with specific height and custom scrollbar */}
                            <div className="h-[450px] p-6 overflow-hidden">
                                <ThinkingTerminal logs={logs} isVisible={true} />
                            </div>

                            <div className="p-6 pt-0">
                                <button
                                    onClick={handleExecuteFetch}
                                    disabled={loading}
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs hover:bg-orange-500 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-30 uppercase tracking-widest"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                                    Execute_Fetch
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-7 space-y-6">
                        {articles.length > 0 ? (
                            articles.map((item, i) => (
                                <div key={i} className="group bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex gap-6 hover:border-orange-500/30 transition-all duration-300">

                                    <div className="w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-white/5">
                                        <img
                                            src={item.thumbnail}
                                            alt="News"
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                                            onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400'; }}
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-bold text-orange-500/80 tracking-widest uppercase">
                                                    {new Date(item.pubDate).toLocaleDateString()} — 0{i + 1}
                                                </span>
                                                <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-[9px] font-bold text-orange-400 uppercase tracking-wider">
                                                    {item.source}
                                                </span>
                                            </div>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-slate-600 hover:text-orange-500 transition-colors flex items-center gap-1 text-xs"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                        <h2 className="text-xl font-semibold text-white leading-snug tracking-tight mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                                            {item.title}
                                        </h2>
                                        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-[558px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4 grayscale opacity-20">
                                <ImageIcon className="w-12 h-12" />
                                <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Idle_Signal</span>
                                <p className="text-xs text-slate-600">Click Execute_Fetch to load news</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsSummarizer;