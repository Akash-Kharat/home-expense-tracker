import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { membersApi } from '../../api/endpoints';
import { useToastStore } from '../../store/toast-store';
import type { Member } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/LoadingSpinner';

export default function MembersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: membersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: membersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      addToast({ type: 'success', message: 'Member created!' });
      closeModal();
    },
    onError: () => addToast({ type: 'error', message: 'Failed to create member' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Member> }) => membersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      addToast({ type: 'success', message: 'Member updated!' });
      closeModal();
    },
    onError: () => addToast({ type: 'error', message: 'Failed to update member' }),
  });

  const deleteMutation = useMutation({
    mutationFn: membersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      addToast({ type: 'success', message: 'Member deleted!' });
      setDeleteId(null);
    },
    onError: () => addToast({ type: 'error', message: 'Failed to delete member' }),
  });

  const openCreate = () => {
    setEditing(null);
    setName('');
    setIncome('');
    setModalOpen(true);
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setName(m.name);
    setIncome(String(m.monthlyIncome));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: { name, monthlyIncome: Number(income) } });
    } else {
      createMutation.mutate({ name, monthlyIncome: Number(income) });
    }
  };

  const toggleActive = (m: Member) => {
    updateMutation.mutate({ id: m.id, data: { isActive: !m.isActive } });
  };

  const columns: Column<Member>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {m.name.charAt(0)}
          </div>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{m.name}</span>
        </div>
      ),
    },
    {
      key: 'monthlyIncome',
      header: 'Monthly Income',
      render: (m) => <span>₹{m.monthlyIncome.toLocaleString()}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (m) => (
        <button onClick={() => toggleActive(m)} className="cursor-pointer">
          <Badge variant={m.isActive ? 'success' : 'danger'}>
            {m.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (m) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => openEdit(m)} className="p-2 rounded-lg transition-colors cursor-pointer hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(m.id)} className="p-2 rounded-lg transition-colors cursor-pointer hover:text-red-400" style={{ color: 'var(--text-secondary)' }}>
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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Members</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your family members.</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Member</Button>
      </div>

      {members.length === 0 ? (
        <EmptyState icon={Users} title="No Members Yet" description="Add family members to start tracking expenses." actionLabel="Add Member" onAction={openCreate} />
      ) : (
        <DataTable columns={columns} data={members} keyExtractor={(m) => m.id} />
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Member' : 'Add Member'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Member name" required />
          <Input label="Monthly Income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="0" required min="0" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Member">
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this member? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
