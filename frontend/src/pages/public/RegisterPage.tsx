import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Home, UserPlus, Users } from 'lucide-react';
import { authApi, invitationsApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/auth-store';
import { useToastStore } from '../../store/toast-store';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite') || '';

  const [mode, setMode] = useState<'new' | 'invite'>(inviteToken ? 'invite' : 'new');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [token, setToken] = useState(inviteToken);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();

  // Auto-switch to invite mode if token in URL
  useEffect(() => {
    if (inviteToken) {
      setMode('invite');
      setToken(inviteToken);
    }
  }, [inviteToken]);

  // Register new family
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      addToast({ type: 'success', message: 'Account created successfully!' });
      navigate('/dashboard');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      addToast({ type: 'error', message: err.response?.data?.message || 'Registration failed' });
    },
  });

  // Accept invitation
  const acceptMutation = useMutation({
    mutationFn: invitationsApi.accept,
    onSuccess: () => {
      addToast({ type: 'success', message: 'Invitation accepted! Please sign in.' });
      navigate('/login');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      addToast({ type: 'error', message: err.response?.data?.message || 'Failed to accept invitation' });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'invite') {
      acceptMutation.mutate({ token, name, password });
    } else {
      registerMutation.mutate({ name, email, password, familyName });
    }
  };

  const isLoading = registerMutation.isPending || acceptMutation.isPending;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
          <Home className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          {mode === 'invite' ? 'Accept Invitation' : 'Create Account'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {mode === 'invite'
            ? 'Join an existing family'
            : 'Start managing your family finances'}
        </p>
      </div>

      {/* Mode Switcher */}
      {!inviteToken && (
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
              mode === 'new'
                ? 'bg-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" /> New Family
          </button>
          <button
            type="button"
            onClick={() => setMode('invite')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
              mode === 'invite'
                ? 'bg-indigo-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Have Invite
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {mode === 'new' && (
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {mode === 'new' ? (
          <Input
            label="Family Name"
            type="text"
            placeholder="The Smiths"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            required
          />
        ) : (
          <Input
            label="Invite Token"
            type="text"
            placeholder="Paste your invitation token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        )}

        <Button type="submit" className="w-full" loading={isLoading}>
          {mode === 'invite' ? 'Join Family' : 'Create Account'}
        </Button>
      </form>

      <p className="text-sm text-slate-400 text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
