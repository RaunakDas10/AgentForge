import React from 'react';
import { getTemplateById } from '../lib/templateRegistry';
import { MeetingScheduler } from './templates/MeetingScheduler';
import { EmailAssistant } from './templates/EmailAssistant';
import WebScraper from './templates/WebScraper';
import NewsSummarizer from './templates/NewsSummarizer';
import { YouTubeAnalyzer } from './templates/YouTubeAnalyzer';
import { DataSync } from './templates/DataSync';
import { SocialMonitor } from './templates/SocialMonitor';
import { AlertSystem } from './templates/AlertSystem';
import { MediCare } from './templates/MediCare';
import { FinancialStress } from './templates/FinancialStress';
import { MedSageLite } from './templates/MedSageLite';
import { GrammarX } from './templates/GrammarX';
import { LinkToQr } from './templates/LinkToQr';

// Placeholder for templates not yet implemented
const PlaceholderTemplate: React.FC<{ templateId: string; onBack: () => void }> = ({ templateId, onBack }) => (
    <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Template: {templateId}</h1>
            <p className="mb-6 text-gray-400">This template is currently under maintenance.</p>
            <button onClick={onBack} className="text-purple-400 hover:text-purple-300 underline">
                Go Back
            </button>
        </div>
    </div>
);

interface TemplatePageProps {
    templateId: string;
    onBack: () => void;
}

export const TemplatePage: React.FC<TemplatePageProps> = ({ templateId, onBack }) => {
    switch (templateId) {
        case 'meeting-scheduler':
            return <MeetingScheduler onBack={onBack} />;
        case 'email-assistant':
            return <EmailAssistant onBack={onBack} />;
        case 'web-scraper':
            return <WebScraper onBack={onBack} />;
        case 'news-summarizer':
            return <NewsSummarizer onBack={onBack} />;
        case 'youtube-analyzer':
            return <YouTubeAnalyzer onBack={onBack} />;
        case 'data-sync':
            return <DataSync onBack={onBack} />;
        case 'social-monitor':
            return <SocialMonitor onBack={onBack} />;
        case 'alert-system':
            return <AlertSystem onBack={onBack} />;
        case 'medicare':
            return <MediCare onBack={onBack} />;
        case 'financial-stress':
            return <FinancialStress onBack={onBack} />;
        case 'medsage-lite':
            return <MedSageLite onBack={onBack} />;
        case 'grammar-x':
            return <GrammarX onBack={onBack} />;
        case 'link-to-qr':
            return <LinkToQr onBack={onBack} />;
        // Add more cases here as we implement them
        default:
            // Fallback for unimplemented templates
            const template = getTemplateById(templateId);
            if (!template) {
                return (
                    <div className="min-h-screen flex items-center justify-center text-white">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-2">Template Not Found</h1>
                            <button onClick={onBack} className="text-purple-400 hover:text-purple-300">
                                Go Back
                            </button>
                        </div>
                    </div>
                );
            }
            return <PlaceholderTemplate templateId={templateId} onBack={onBack} />;
    }
};
