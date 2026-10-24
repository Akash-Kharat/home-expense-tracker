import { useState, useEffect, type FormEvent } from 'react';
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
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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

  // FIX: getSummary returns Budget objects ({ ...budget, spent, remaining })
  // so the budget amount field is .amount, NOT .budget
  const totalBudget = summary.reduce((s: number, b: any) => s + (Number(b.amount) || 0), 0);
  const totalSpent = summary.reduce((s: number, b: any) => s + (Number(b.spent) || 0), 0);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Budgets</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Set and track monthly category budgets.</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthYearPicker month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
          <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-2xl p-5" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Budget</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>₹{totalBudget.toLocaleString()}</p>
        </div>
        <div className="border rounded-2xl p-5" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Spent</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">₹{totalSpent.toLocaleString()}</p>
        </div>
        <div className="border rounded-2xl p-5" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Remaining</p>
          <p className={`text-2xl font-bold mt-1 ${totalBudget - totalSpent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ₹{(totalBudget - totalSpent).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Budget table */}
      {budgets.length === 0 ? (
        <EmptyState icon={Wallet} title="No Budgets" description="Create budgets for this month to start tracking." actionLabel="Add Budget" onAction={openCreate} />
      ) : (
        <div className="border rounded-2xl overflow-hidden backdrop-blur-xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: 'var(--text-secondary)' }}>Category</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: 'var(--text-secondary)' }}>Budget</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: 'var(--text-secondary)' }}>Spent</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: 'var(--text-secondary)' }}>Remaining</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: 'var(--text-secondary)' }}>Usage</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b: any) => {
                  // FIX: summary items are Budget objects with added spent field
                  // budget amount is b.amount, matching is by b.categoryId
                  const summaryItem = summary.find((s: any) => s.categoryId === b.categoryId);
                  const spent = Number(summaryItem?.spent) || 0;
                  const remaining = b.amount - spent;
                  const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
                  return (
                    <tr
                      key={b.id}
                      className="border-b transition-colors"
                      style={{ borderColor: 'var(--border-color)' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.category?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-right" style={{ color: 'var(--text-secondary)' }}>₹{b.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-amber-400 text-right">₹{spent.toLocaleString()}</td>
                      <td className={`px-6 py-4 text-sm font-medium text-right ${remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ₹{remaining.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                            <div
                              className={`h-full rounded-full transition-all ${pct > 100 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs w-10 text-right" style={{ color: 'var(--text-secondary)' }}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(b)} className="p-2 rounded-lg transition-colors cursor-pointer hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(b.id)} className="p-2 rounded-lg transition-colors cursor-pointer hover:text-red-400" style={{ color: 'var(--text-secondary)' }}>
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
            {categories.map((c: any) => (
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
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this budget?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
