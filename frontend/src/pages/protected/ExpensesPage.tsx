import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, Plus, Search, Trash2, Edit3, Calendar } from 'lucide-react';
import { expensesApi, categoriesApi, membersApi, settlementsApi } from '../../api/endpoints';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import MonthYearPicker from '../../components/ui/MonthYearPicker';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToastStore } from '../../store/toast-store';
import type { Expense } from '../../types';

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMember, setFilterMember] = useState('');

  const [form, setForm] = useState({
    categoryId: '',
    paidByMemberId: '',
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
  });

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses', month, year],
    queryFn: () => expensesApi.getAll(month, year),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: () => membersApi.getAll(),
  });

  // Auto-regenerate settlements silently after expense change
  const silentGenerateSettlements = (m: number, y: number) => {
    settlementsApi.generate(m, y).then(() => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    }).catch(() => {}); // Silent failure — settlements are best-effort
  };

  const createMutation = useMutation({
    mutationFn: expensesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-summary'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      addToast('Expense added successfully', 'success');
      closeModal();
      // Auto-regenerate settlements
      silentGenerateSettlements(month, year);
    },
    onError: () => addToast('Failed to add expense', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => expensesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-summary'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      addToast('Expense updated successfully', 'success');
      closeModal();
      silentGenerateSettlements(month, year);
    },
    onError: () => addToast('Failed to update expense', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: expensesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['budgets-summary'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      addToast('Expense deleted', 'success');
      silentGenerateSettlements(month, year);
    },
    onError: () => addToast('Failed to delete expense', 'error'),
  });

  const openCreate = () => {
    setEditingExpense(null);
    setForm({ categoryId: '', paidByMemberId: '', amount: '', description: '', expenseDate: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setForm({
      categoryId: expense.categoryId,
      paidByMemberId: expense.paidByMemberId,
      amount: String(expense.amount),
      description: expense.description || '',
      expenseDate: expense.expenseDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      categoryId: form.categoryId,
      paidByMemberId: form.paidByMemberId,
      amount: parseFloat(form.amount),
      description: form.description,
      expenseDate: form.expenseDate,
      month,
      year,
    };

    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredExpenses = expenses.filter((exp: Expense) => {
    const matchesSearch = !searchQuery || exp.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || exp.categoryId === filterCategory;
    const matchesMember = !filterMember || exp.paidByMemberId === filterMember;
    return matchesSearch && matchesCategory && matchesMember;
  });

  const totalAmount = filteredExpenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);

  if (isLoading) return <LoadingSpinner />;

  const selectStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-primary)',
    colorScheme: 'inherit' as any,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Expenses</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Track and manage spending</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthYearPicker month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none transition"
            style={selectStyle}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none transition"
          style={selectStyle}
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={filterMember}
          onChange={(e) => setFilterMember(e.target.value)}
          className="px-4 py-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none transition"
          style={selectStyle}
        >
          <option value="">All Members</option>
          {members.map((m: any) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </GlassCard>

      {/* Summary Card */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Receipt className="w-5 h-5 text-indigo-400" />
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>Total Expenses ({filteredExpenses.length} items)</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>₹{totalAmount.toLocaleString()}</span>
        </div>
      </GlassCard>

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <EmptyState icon={Receipt} title="No expenses found" description="Add your first expense to start tracking." />
      ) : (
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Date</th>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Category</th>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Paid By</th>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Description</th>
                  <th className="text-right p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Amount</th>
                  <th className="text-right p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredExpenses.map((expense: Expense, index: number) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b transition"
                      style={{ borderColor: 'var(--border-color)' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg">
                          {expense.category?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{expense.paidBy?.name || 'Unknown'}</td>
                      <td className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{expense.description || '-'}</td>
                      <td className="p-4 text-sm text-right font-semibold" style={{ color: 'var(--text-primary)' }}>₹{expense.amount.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(expense)}
                            className="p-2 rounded-lg transition cursor-pointer hover:opacity-80"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { if (confirm('Delete this expense?')) deleteMutation.mutate(expense.id); }}
                            className="p-2 rounded-lg transition cursor-pointer hover:text-red-400"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
          <Select
            label="Paid By"
            value={form.paidByMemberId}
            onChange={(e) => setForm({ ...form, paidByMemberId: e.target.value })}
            required
          >
            <option value="">Select member</option>
            {members.filter((m: any) => m.isActive).map((m: any) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Select>
          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional description"
          />
          <Input
            label="Date"
            type="date"
            value={form.expenseDate}
            onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
            required
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending} className="flex-1">
              {editingExpense ? 'Update' : 'Add'} Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
