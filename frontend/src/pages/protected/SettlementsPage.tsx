import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, RefreshCw, Check, Clock, ArrowRight } from 'lucide-react';
import { settlementsApi } from '../../api/endpoints';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import MonthYearPicker from '../../components/ui/MonthYearPicker';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import { useToastStore } from '../../store/toast-store';
import type { Settlement } from '../../types';

export default function SettlementsPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [activeTab, setActiveTab] = useState<'PENDING' | 'SETTLED'>('PENDING');

  const { data: settlements = [], isLoading } = useQuery({
    queryKey: ['settlements', month, year],
    queryFn: () => settlementsApi.getAll(month, year),
  });

  const generateMutation = useMutation({
    mutationFn: () => settlementsApi.generate(month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      addToast('Settlements generated successfully', 'success');
    },
    onError: () => addToast('Failed to generate settlements', 'error'),
  });

  const settleMutation = useMutation({
    mutationFn: (id: string) => settlementsApi.markSettled(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      addToast('Settlement marked as settled', 'success');
    },
    onError: () => addToast('Failed to settle', 'error'),
  });

  const pendingSettlements = settlements.filter((s: Settlement) => s.status === 'PENDING');
  const settledSettlements = settlements.filter((s: Settlement) => s.status === 'SETTLED');
  const currentList = activeTab === 'PENDING' ? pendingSettlements : settledSettlements;

  const totalPending = pendingSettlements.reduce((sum: number, s: Settlement) => sum + s.amount, 0);
  const totalSettled = settledSettlements.reduce((sum: number, s: Settlement) => sum + s.amount, 0);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Settlements</h1>
          <p className="text-slate-400 mt-1">Monthly reimbursement tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthYearPicker month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
          <Button
            onClick={() => generateMutation.mutate()}
            loading={generateMutation.isPending}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Generate
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-xl font-bold text-white">₹{totalPending.toLocaleString()}</p>
              </div>
            </div>
            <span className="text-sm text-amber-400">{pendingSettlements.length} items</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Settled</p>
                <p className="text-xl font-bold text-white">₹{totalSettled.toLocaleString()}</p>
              </div>
            </div>
            <span className="text-sm text-emerald-400">{settledSettlements.length} items</span>
          </div>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {(['PENDING', 'SETTLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'PENDING' ? `Pending (${pendingSettlements.length})` : `Settled (${settledSettlements.length})`}
          </button>
        ))}
      </div>

      {/* Settlement Cards */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={ArrowRightLeft}
          title={`No ${activeTab.toLowerCase()} settlements`}
          description={activeTab === 'PENDING' ? 'Generate settlements to see who owes whom.' : 'No settlements have been marked as settled yet.'}
        />
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {currentList.map((settlement: Settlement, index: number) => (
              <motion.div
                key={settlement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-red-400">
                            {settlement.fromMember?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{settlement.fromMember?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">owes</p>
                        </div>
                      </div>

                      <ArrowRight className="w-5 h-5 text-indigo-400 flex-shrink-0" />

                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-emerald-400">
                            {settlement.toMember?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{settlement.toMember?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">receives</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-white">₹{settlement.amount.toLocaleString()}</span>
                      {settlement.status === 'PENDING' ? (
                        <Button
                          size="sm"
                          onClick={() => settleMutation.mutate(settlement.id)}
                          loading={settleMutation.isPending}
                          className="flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Settle
                        </Button>
                      ) : (
                        <Badge variant="success">Settled</Badge>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
