import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Tags } from 'lucide-react';
import { categoriesApi, membersApi } from '../../api/endpoints';
import { useToastStore } from '../../store/toast-store';
import type { Category } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/LoadingSpinner';

const categoryTypes = ['EXPENSE', 'SAVINGS', 'INVESTMENT'] as const;

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<string>('EXPENSE');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [managerId, setManagerId] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: membersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ type: 'success', message: 'Category created!' });
      closeModal();
    },
    onError: () => addToast({ type: 'error', message: 'Failed to create category' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ type: 'success', message: 'Category updated!' });
      closeModal();
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update category' }),
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ type: 'success', message: 'Category deleted!' });
      setDeleteId(null);
    },
    onError: () => addToast({ type: 'error', message: 'Failed to delete category' }),
  });

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setType(activeTab);
    setManagerId(members[0]?.id || '');
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setName(c.name);
    setType(c.type);
    setManagerId(c.managerId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: { name, type: type as any, managerId } });
    } else {
      createMutation.mutate({ name, type, managerId });
    }
  };

  const columns: Column<Category>[] = [
    { key: 'name', header: 'Name', render: (c) => <span className="font-medium text-white">{c.name}</span> },
    {
      key: 'type',
      header: 'Type',
      render: (c) => (
        <Badge variant={c.type === 'EXPENSE' ? 'danger' : c.type === 'SAVINGS' ? 'success' : 'info'}>
          {c.type}
        </Badge>
      ),
    },
    { key: 'manager', header: 'Manager', render: (c) => <span>{c.manager?.name || '—'}</span> },
    {
      key: 'isActive',
      header: 'Status',
      render: (c) => <Badge variant={c.isActive ? 'success' : 'danger'}>{c.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(c.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-slate-400 mt-1">Organize your expenses by category.</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Category</Button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit border border-white/10">
        {categoryTypes.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === t ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState icon={Tags} title="No Categories" description={`No ${activeTab.toLowerCase()} categories found. Create one to get started.`} actionLabel="Add Category" onAction={openCreate} />
      ) : (
        <DataTable columns={columns} data={filteredCategories} keyExtractor={(c) => c.id} />
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required />
          <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
            {categoryTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Select label="Manager" value={managerId} onChange={(e) => setManagerId(e.target.value)}>
            <option value="">Select manager</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Category">
        <p className="text-slate-400 mb-6">Are you sure you want to delete this category?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
