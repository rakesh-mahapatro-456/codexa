import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Save, X, Trophy, Target, Calendar, Zap, Award, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateUser, updatePassword } from '@/store/feature/auth/authThunk';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, clearMessage } from '@/store/feature/auth/authSlice';

const ProfileCard = () => {
  const dispatch = useDispatch();
  const { user, loading, error, message } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    name: '',
    currentPassword: '',
    newPassword: '',
    language: 'python',
    dailyTarget: 3
  });

  useEffect(() => {
    if (user) {
      setEditForm(prev => ({
        ...prev,
        username: user.username || '',
        name: user.name || '',
        language: user.language || 'python',
        dailyTarget: user.dailyTarget || 3
      }));
    }
  }, [user]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle success messages
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show error state if user data couldn't be loaded
  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">
            Unable to load profile data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const languages = [
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' }
  ];

  const handleEdit = () => {
    // Clear any existing errors when entering edit mode
    if (error) {
      dispatch(clearError());
    }
    
    setIsEditing(true);
    setEditForm(prev => ({
      ...prev,
      username: user.username || '',
      name: user.name || '',
      currentPassword: '',
      newPassword: '',
      language: user.language || 'python',
      dailyTarget: user.dailyTarget || 3
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      // Basic validation
      if (!editForm.name.trim()) {
        toast('Name cannot be empty');
        return;
      }
      
      if (!editForm.username.trim()) {
        toast('Username cannot be empty');
        return;
      }

      // Prepare profile update data (without password)
      const updateData = {
        name: editForm.name.trim(),
        username: editForm.username.trim(),
        language: editForm.language,
        dailyTarget: parseInt(editForm.dailyTarget) || 3
      };

      // Check if we need to update the password
      const isPasswordUpdate = !!editForm.newPassword;
      
      // If password is being updated, validate it first
      if (isPasswordUpdate) {
        if (!editForm.currentPassword) {
          toast('Please enter your current password to change it');
          return;
        }
        
        if (editForm.newPassword.length < 6) {
          toast('New password must be at least 6 characters long');
          return;
        }
      }

      // First update the user profile
      const result = await dispatch(updateUser(updateData)).unwrap();
      
      // If new password is provided, update it separately
      if (isPasswordUpdate) {
        try {
          // Call updatePassword thunk with oldPassword (not currentPassword) to match backend
          await dispatch(updatePassword({
            oldPassword: editForm.currentPassword,
            newPassword: editForm.newPassword
          })).unwrap();
          
          // Clear password fields after successful update
          setEditForm(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: ''
          }));
          
          toast.success('Password updated successfully');
        } catch (error) {
          // If password update fails but profile update succeeded
          toast('Profile updated but password update failed: ' + (error || 'Please check your current password'));
          throw error; // Re-throw to be caught by the outer catch
        }
      }
      
      // Only show success and close if everything succeeded
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      // Error will be handled by the error effect
      console.error('Failed to update profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    // Clear any existing error when user starts typing
    if (error) {
      dispatch(clearError());
    }
    
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and view your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-2">
            <Card className="h-fit bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-900 dark:text-white">Account Settings</span>
                  </CardTitle>
                  {!isEditing ? (
                    <Button 
                      onClick={handleEdit} 
                      variant="outline" 
                      className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Settings
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSave} 
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        onClick={handleCancel} 
                        variant="outline" 
                        className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 p-6">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Display Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:placeholder:text-gray-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Username</Label>
                      <Input
                        id="username"
                        value={editForm.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type="password"
                          value={editForm.currentPassword}
                          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          placeholder="Enter your current password"
                          className="border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:placeholder:text-gray-500 pr-10"
                        />
                      </div>
                      
                      <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type="password"
                          value={editForm.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          placeholder="Enter new password"
                          className="border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:placeholder:text-gray-500 pr-10"
                        />
                        {editForm.newPassword && editForm.newPassword.length < 6 && (
                          <p className="mt-1 text-xs text-red-500">Password must be at least 6 characters</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Language</Label>
                      <Select value={editForm.language} onValueChange={(value) => handleInputChange('language', value)}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          {languages.map((lang) => (
                            <SelectItem 
                              key={lang.value} 
                              value={lang.value} 
                              className="dark:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                            >
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="dailyTarget" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Daily Problem Target</Label>
                      <Input
                        id="dailyTarget"
                        type="number"
                        min="1"
                        max="50"
                        value={editForm.dailyTarget}
                        onChange={(e) => handleInputChange('dailyTarget', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Display Name</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{user?.name || 'N/A'}</div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Username</div>
                        <div className="font-semibold text-gray-900 dark:text-white">@{user?.username || 'N/A'}</div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Preferred Language</div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800">
                          {user?.language ? languages.find(lang => lang.value === user.language)?.label : 'Not set'}
                        </Badge>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Target</div>
                        <div className="font-semibold text-gray-900 dark:text-white flex items-center">
                          <Target className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                          {user?.dailyTarget || 0} problems
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email Address</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{user?.email || 'N/A'}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Achievement Overview */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  <span className="text-gray-900 dark:text-white">Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-lg border dark:border-blue-800/30">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Problems Solved</span>
                    </div>
                    <span className="font-bold text-blue-700 dark:text-blue-300">{user?.problemsSolved || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 rounded-lg border dark:border-purple-800/30">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total XP</span>
                    </div>
                    <span className="font-bold text-purple-700 dark:text-purple-300">{user?.xp || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 rounded-lg border dark:border-green-800/30">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Streak</span>
                    </div>
                    <span className="font-bold text-green-700 dark:text-green-300">{user?.streak || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 rounded-lg border dark:border-orange-800/30">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Streak</span>
                    </div>
                    <span className="font-bold text-orange-700 dark:text-orange-300">{user?.longestStreak || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-900 dark:text-white">Account Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Email</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Help Given</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{user?.helpCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Helper XP</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{user?.xpEarnedFromHelping || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Joined
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user?.dateJoined ? new Date(user.dateJoined).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;