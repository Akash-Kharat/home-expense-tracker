import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Wallet } from 'lucide-react';
import { budgetsApi, categoriesApi } from '../../api/endpoints';
import { useToastStore } from '../../store/toast-store';
import type { Budget } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import MonthYearPicker from '../../components/ui/MonthYearPicker';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/LoadingSpinner';

export default function BudgetsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ['budgets', month, year],
    queryFn: () => budgetsApi.getAll(month, year),
  });

  const { data: summary = [] } = useQuery({
    queryKey: ['budgets-summary', month, year],
    queryFn: () => budgetsApi.getSummary(month, year),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: budgetsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-summary'] });
      addToast({ type: 'success', message: 'Budget created!' });
      closeModal();
    },
    onError: () => addToast({ type: 'error', message: 'Failed to create budget' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { amount: number } }) => budgetsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-summary'] });
      addToast({ type: 'success', message: 'Budget updated!' });
      closeModal();
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update budget' }),
  });

  const deleteMutation = useMutation({
    mutationFn: budgetsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-summary'] });
      addToast({ type: 'success', message: 'Budget deleted!' });
      setDeleteId(null);
    },
    onError: () => addToast({ type: 'error', message: 'Failed to delete budget' }),
  });

  const openCreate = () => {
    setEditing(null);
    setCategoryId(categories[0]?.id || '');
    setAmount('');
    setModalOpen(true);
  };

  const openEdit = (b: Budget) => {
    setEditing(b);
    setCategoryId(b.categoryId);
    setAmount(String(b.amount));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: { amount: Number(amount) } });
    } else {
      createMutation.mutate({ categoryId, amount: Number(amount), month, year });
    }
  };

  const totalBudget = summary.reduce((s, b) => s + b.budget, 0);
  const totalSpent = summary.reduce((s, b) => s + b.spent, 0);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Budgets</h1>
          <p className="text-sm text-slate-400 mt-1">Set and track monthly category budgets.</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthYearPicker month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
          <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-slate-400">Total Budget</p>
          <p className="text-2xl font-bold text-white mt-1">₹{totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-slate-400">Total Spent</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">₹{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-slate-400">Remaining</p>
          <p className={`text-2xl font-bold mt-1 ${totalBudget - totalSpent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ₹{(totalBudget - totalSpent).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Budget table */}
      {budgets.length === 0 ? (
        <EmptyState icon={Wallet} title="No Budgets" description="Create budgets for this month to start tracking." actionLabel="Add Budget" onAction={openCreate} />
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Category</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Budget</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Spent</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Remaining</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Usage</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {budgets.map((b) => {
                  const summaryItem = summary.find((s) => s.category?.id === b.categoryId);
                  const spent = summaryItem?.spent || 0;
                  const remaining = b.amount - spent;
                  const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{b.category?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-300 text-right">₹{b.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-amber-400 text-right">₹{spent.toLocaleString()}</td>
                      <td className={`px-6 py-4 text-sm font-medium text-right ${remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ₹{remaining.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct > 100 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-10 text-right">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(b.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Budget' : 'Add Budget'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={!!editing}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required min="0" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Budget">
        <p className="text-slate-400 mb-6">Are you sure you want to delete this budget?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
