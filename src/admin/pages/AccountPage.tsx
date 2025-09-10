import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';

export default function AccountPage() {
  const { updateEmail, updatePassword, user } = useAuth();
  const { isLightMode } = useAdminTheme();

  // Email form state
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const onUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailMessage(null);

    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailLoading(true);
    const { error } = await updateEmail(currentPasswordForEmail, newEmail);
    setEmailLoading(false);
    if (error) {
      setEmailError(error.message);
    } else {
      setEmailMessage('Email updated successfully.');
      setCurrentPasswordForEmail('');
    }
  };

  const onUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdMessage(null);

    if (newPassword.length < 8) {
      setPwdError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New password and confirmation do not match.');
      return;
    }

    setPwdLoading(true);
    const { error } = await updatePassword(currentPassword, newPassword);
    setPwdLoading(false);
    if (error) {
      setPwdError(error.message);
    } else {
      setPwdMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${isLightMode ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Manage Account</h1>
          <p className={`${isLightMode ? 'text-gray-600' : 'text-gray-400'} mt-1`}>Update your login email and password.</p>
        </div>

        {/* Update Email */}
        <div className={`rounded-xl shadow-sm overflow-hidden border mb-8 ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
          <div className="px-6 py-5 border-b ${isLightMode ? 'border-gray-100' : 'border-slate-700'}">
            <h2 className={`${isLightMode ? 'text-gray-900' : 'text-white'} font-semibold`}>Change Email</h2>
            <p className={`${isLightMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Enter your current password to confirm.</p>
          </div>
          <form onSubmit={onUpdateEmail} className="p-6 space-y-4">
            {emailError && (
              <div className="rounded-md bg-red-50 p-3 text-red-700 text-sm">{emailError}</div>
            )}
            {emailMessage && (
              <div className="rounded-md bg-green-50 p-3 text-green-700 text-sm">{emailMessage}</div>
            )}
            <div>
              <label className={`${isLightMode ? 'text-gray-700' : 'text-gray-300'} block text-sm font-medium mb-1`}>New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                required
              />
            </div>
            <div>
              <label className={`${isLightMode ? 'text-gray-700' : 'text-gray-300'} block text-sm font-medium mb-1`}>Current Password</label>
              <input
                type="password"
                value={currentPasswordForEmail}
                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={emailLoading}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {emailLoading ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </form>
        </div>

        {/* Update Password */}
        <div className={`rounded-xl shadow-sm overflow-hidden border ${isLightMode ? 'bg-white border-gray-100' : 'bg-slate-800 border-slate-700'}`}>
          <div className="px-6 py-5 border-b ${isLightMode ? 'border-gray-100' : 'border-slate-700'}">
            <h2 className={`${isLightMode ? 'text-gray-900' : 'text-white'} font-semibold`}>Change Password</h2>
            <p className={`${isLightMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Ensure your new password is strong.</p>
          </div>
          <form onSubmit={onUpdatePassword} className="p-6 space-y-4">
            {pwdError && (
              <div className="rounded-md bg-red-50 p-3 text-red-700 text-sm">{pwdError}</div>
            )}
            {pwdMessage && (
              <div className="rounded-md bg-green-50 p-3 text-green-700 text-sm">{pwdMessage}</div>
            )}
            <div>
              <label className={`${isLightMode ? 'text-gray-700' : 'text-gray-300'} block text-sm font-medium mb-1`}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                required
              />
            </div>
            <div>
              <label className={`${isLightMode ? 'text-gray-700' : 'text-gray-300'} block text-sm font-medium mb-1`}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                required
              />
            </div>
            <div>
              <label className={`${isLightMode ? 'text-gray-700' : 'text-gray-300'} block text-sm font-medium mb-1`}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-900' : 'border-slate-600 bg-slate-700 text-white'}`}
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={pwdLoading}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {pwdLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
