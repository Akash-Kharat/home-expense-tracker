import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Settings, Lock, Unlock, Mail, Send, Trash2, UserPlus, Home, User } from 'lucide-react';
import { invitationsApi, monthLocksApi } from '../../api/endpoints';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuthStore } from '../../store/auth-store';
import { useToastStore } from '../../store/toast-store';
import type { Invitation } from '../../types';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();
  const now = new Date();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [lockMonth, setLockMonth] = useState(now.getMonth() + 1);
  const [lockYear, setLockYear] = useState(now.getFullYear());

  // Invitations
  const { data: invitations = [], isLoading: loadingInvites } = useQuery({
    queryKey: ['invitations'],
    queryFn: () => invitationsApi.getAll(),
  });

  // Month Lock Status
  const { data: lockStatus } = useQuery({
    queryKey: ['month-lock', lockMonth, lockYear],
    queryFn: () => monthLocksApi.getStatus(lockMonth, lockYear),
  });

  const inviteMutation = useMutation({
    mutationFn: () => invitationsApi.invite(inviteEmail, inviteRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      addToast('Invitation sent!', 'success');
      setInviteEmail('');
    },
    onError: (e: any) => addToast(e.response?.data?.message || 'Failed to send invite', 'error'),
  });

  const deleteInviteMutation = useMutation({
    mutationFn: invitationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      addToast('Invitation deleted', 'success');
    },
  });

  const lockMutation = useMutation({
    mutationFn: () => monthLocksApi.lock(lockMonth, lockYear),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-lock'] });
      addToast('Month locked', 'success');
    },
    onError: () => addToast('Failed to lock month', 'error'),
  });

  const unlockMutation = useMutation({
    mutationFn: () => monthLocksApi.unlock(lockMonth, lockYear),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-lock'] });
      addToast('Month unlocked', 'success');
    },
    onError: () => addToast('Failed to unlock month', 'error'),
  });

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your family and account</p>
      </div>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Account</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Name</label>
              <p className="text-white font-medium mt-1">{user?.name || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Email</label>
              <p className="text-white font-medium mt-1">{user?.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Role</label>
              <div className="mt-1">
                <Badge variant={user?.role === 'ADMIN' ? 'info' : 'warning'}>{user?.role || '-'}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400">Family ID</label>
              <p className="text-white font-medium mt-1 font-mono text-xs">{user?.familyId || '-'}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Invite Members (Admin only) */}
      {isAdmin && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <UserPlus className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Invite Members</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button
                onClick={() => inviteMutation.mutate()}
                loading={inviteMutation.isPending}
                disabled={!inviteEmail}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Invite
              </Button>
            </div>

            {/* Pending Invitations */}
            <h3 className="text-sm font-medium text-slate-400 mb-3">Pending Invitations</h3>
            {loadingInvites ? (
              <LoadingSpinner />
            ) : invitations.length === 0 ? (
              <p className="text-slate-500 text-sm">No pending invitations</p>
            ) : (
              <div className="space-y-2">
                {invitations.map((inv: Invitation) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-white">{inv.email}</p>
                        <p className="text-xs text-slate-500">
                          {inv.used ? 'Used' : `Expires ${new Date(inv.expiresAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={inv.used ? 'success' : 'warning'}>{inv.used ? 'Accepted' : inv.role}</Badge>
                      {!inv.used && (
                        <button
                          onClick={() => deleteInviteMutation.mutate(inv.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Share token info */}
            {invitations.filter((i: Invitation) => !i.used).length > 0 && (
              <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <p className="text-xs text-indigo-300">
                  💡 Share the invite token with your family members. They can use it at the registration page to join your family.
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Month Lock (Admin only) */}
      {isAdmin && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Month Lock</h2>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Lock a month to prevent changes to expenses, budgets, and settlements.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Month</label>
                <select
                  value={lockMonth}
                  onChange={(e) => setLockMonth(Number(e.target.value))}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                >
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Year</label>
                <select
                  value={lockYear}
                  onChange={(e) => setLockYear(Number(e.target.value))}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                {lockStatus?.isLocked ? (
                  <Button
                    variant="secondary"
                    onClick={() => unlockMutation.mutate()}
                    loading={unlockMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Unlock className="w-4 h-4" /> Unlock
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={() => lockMutation.mutate()}
                    loading={lockMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Lock Month
                  </Button>
                )}
                <Badge variant={lockStatus?.isLocked ? 'danger' : 'success'}>
                  {lockStatus?.isLocked ? 'Locked' : 'Open'}
                </Badge>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
