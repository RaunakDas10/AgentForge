import React, { useEffect, useState } from 'react';
import { X, Clock, CheckCircle, XCircle, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { agentService } from '../services/agentService';

interface ExecutionViewerProps {
  agentId: string;
  agentName: string;
  onClose: () => void;
}

interface Execution {
  _id: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    data?: any;
  }>;
  results: Array<{
    nodeId: string;
    nodeType: string;
    nodeLabel: string;
    result: any;
    timestamp: string;
  }>;
  error?: string;
}

export const ExecutionViewer: React.FC<ExecutionViewerProps> = ({ agentId, agentName, onClose }) => {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadExecutions();
    const interval = setInterval(loadExecutions, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [agentId]);

  const loadExecutions = async () => {
    try {
      const data = await agentService.getExecutions(agentId);
      setExecutions(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load executions:', error);
      setLoading(false);
    }
  };

  const toggleResult = (resultId: string) => {
    setExpandedResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resultId)) {
        newSet.delete(resultId);
      } else {
        newSet.add(resultId);
      }
      return newSet;
    });
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Execution History</h2>
            <p className="text-gray-400 mt-1">{agentName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No execution history yet</p>
              <p className="text-gray-500 text-sm mt-2">Run your agent to see results here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <div
                  key={execution._id}
                  className={`bg-white/5 rounded-xl border ${getStatusColor(execution.status)} overflow-hidden`}
                >
                  {/* Execution Header */}
                  <button
                    onClick={() => setExpandedExecution(
                      expandedExecution === execution._id ? null : execution._id
                    )}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(execution.status)}
                      <div className="text-left">
                        <div className="text-white font-medium">
                          {execution.status === 'running' ? 'Running...' : 
                           execution.status === 'completed' ? 'Completed' : 'Failed'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(execution.startTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Duration</div>
                        <div className="text-white font-mono">
                          {formatDuration(execution.duration)}
                        </div>
                      </div>
                      {expandedExecution === execution._id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Execution Details */}
                  {expandedExecution === execution._id && (
                    <div className="border-t border-white/10 p-4 space-y-6">
                      {/* Results */}
                      {execution.results.length > 0 && (
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Results ({execution.results.length})
                          </h4>
                          <div className="space-y-2">
                            {execution.results.map((result, idx) => (
                              <div key={idx} className="bg-white/5 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => toggleResult(`${execution._id}-${idx}`)}
                                  className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-purple-400 font-mono text-sm">
                                      {result.nodeType}
                                    </span>
                                    <span className="text-gray-400">›</span>
                                    <span className="text-white">{result.nodeLabel}</span>
                                  </div>
                                  {expandedResults.has(`${execution._id}-${idx}`) ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                                
                                {expandedResults.has(`${execution._id}-${idx}`) && (
                                  <div className="p-3 border-t border-white/10">
                                    <pre className="text-xs text-gray-300 overflow-x-auto bg-black/30 p-3 rounded">
                                      {JSON.stringify(result.result, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Logs */}
                      {execution.logs.length > 0 && (
                        <div>
                          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            Execution Logs ({execution.logs.length})
                          </h4>
                          <div className="bg-black/30 rounded-lg p-4 space-y-1 max-h-64 overflow-y-auto font-mono text-xs">
                            {execution.logs.map((log, idx) => (
                              <div key={idx} className={`${getLevelColor(log.level)}`}>
                                <span className="text-gray-500">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                {' › '}
                                <span className="font-semibold uppercase">[{log.level}]</span>
                                {' '}
                                {log.message}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Error */}
                      {execution.error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                            <XCircle className="w-4 h-4" />
                            Error
                          </div>
                          <p className="text-red-300 text-sm">{execution.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};