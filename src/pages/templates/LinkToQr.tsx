
import React, { useState, useRef } from 'react';
import { ArrowLeft, Link, Download, QrCode, FileImage } from 'lucide-react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

interface LinkToQrProps {
    onBack: () => void;
}

export const LinkToQr: React.FC<LinkToQrProps> = ({ onBack }) => {
    const [url, setUrl] = useState('');
    const canvasRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<HTMLDivElement>(null);

    const downloadPNG = () => {
        const canvas = canvasRef.current?.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "qrcode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const downloadSVG = () => {
        const svg = svgRef.current?.querySelector('svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = "qrcode.svg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
            <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-400" />
                        </button>
                        <div className="p-2 rounded-lg bg-purple-500/20">
                            <QrCode className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Link to QR Generator</h1>
                            <p className="text-sm text-slate-400">Utilities</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Generate QR Code</h2>
                            <p className="text-gray-400 mb-6">Enter a URL or text to generate a static QR code instantly.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Target URL / Text</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Link className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                            <h3 className="font-bold text-blue-400 mb-2">Pro Tip</h3>
                            <p className="text-sm text-gray-300">
                                You can use this tool to generate QR codes for Wi-Fi networks, contact cards (vCard), or simple text messages.
                            </p>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                        {url ? (
                            <div className="space-y-8 flex flex-col items-center w-full">
                                <div className="bg-white p-4 rounded-xl shadow-2xl">
                                    <div ref={canvasRef}>
                                        <QRCodeCanvas
                                            value={url}
                                            size={256}
                                            level={"H"}
                                            includeMargin={false}
                                        />
                                    </div>
                                    {/* Hidden SVG for download purposes */}
                                    <div ref={svgRef} className="hidden">
                                        <QRCodeSVG
                                            value={url}
                                            size={256}
                                            level={"H"}
                                            includeMargin={false}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                                    <button
                                        onClick={downloadPNG}
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>PNG</span>
                                    </button>
                                    <button
                                        onClick={downloadSVG}
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-all"
                                    >
                                        <FileImage className="w-4 h-4" />
                                        <span>SVG</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <QrCode className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Enter text to generate QR code</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
