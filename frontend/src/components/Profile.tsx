import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { authService } from '../services/authService';
import { User, Save, Upload, Download, Edit3, CheckCircle, X } from 'lucide-react';

interface OnboardingQuestion {
  id: string;
  question: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface OnboardingSection {
  [key: string]: OnboardingQuestion[];
}

interface OnboardingData {
  [key: string]: any;
}

const Profile: React.FC = () => {
  const [onboardingQuestions, setOnboardingQuestions] = useState<OnboardingSection>({});
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string>('basic_info');
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      setLoading(true);
      
      // Load onboarding questions
      const questionsResponse = await authService.getOnboardingQuestions();
      setOnboardingQuestions(questionsResponse);
      
      // Load user's existing onboarding data
      const dataResponse = await authService.getOnboardingData();
      setOnboardingData(dataResponse);
      
    } catch (error) {
      console.error('Error loading onboarding data:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      // Update onboarding data via API
      const response = await authService.saveOnboardingData(onboardingData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditingField(null);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const startEditing = (fieldId: string) => {
    setEditingField(fieldId);
  };

  const stopEditing = () => {
    setEditingField(null);
  };

  const renderField = (question: OnboardingQuestion) => {
    const value = onboardingData[question.id] || '';
    const hasValue = value !== '' && value !== null && value !== undefined;
    const isEditing = editingField === question.id || !hasValue;

    const renderInput = () => {
      switch (question.type) {
        case 'text':
        case 'email':
        case 'tel':
          return (
            <Input
              type={question.type}
              value={value}
              onChange={(e) => handleFieldChange(question.id, e.target.value)}
              placeholder={`Enter ${question.question.toLowerCase()}`}
              disabled={!isEditing}
            />
          );
        case 'textarea':
          return (
            <Textarea
              value={value}
              onChange={(e) => handleFieldChange(question.id, e.target.value)}
              placeholder={`Enter ${question.question.toLowerCase()}`}
              disabled={!isEditing}
              rows={4}
            />
          );
        case 'select':
          return (
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(question.id, val)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case 'boolean':
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={value === true || value === 'true'}
                onCheckedChange={(checked) => handleFieldChange(question.id, checked)}
                disabled={!isEditing}
              />
              <Label className="text-sm">
                {value === true || value === 'true' ? 'Yes' : 'No'}
              </Label>
            </div>
          );
        default:
          return (
            <Input
              value={value}
              onChange={(e) => handleFieldChange(question.id, e.target.value)}
              placeholder={`Enter ${question.question.toLowerCase()}`}
              disabled={!isEditing}
            />
          );
      }
    };

    return (
      <div key={question.id} className={`space-y-2 p-4 rounded-lg border ${
        !hasValue 
          ? 'bg-yellow-50 border-yellow-200' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {question.question}
            {question.required && <span className="text-red-500 ml-1">*</span>}
            {!hasValue && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Not answered
              </span>
            )}
          </Label>
          {hasValue && !isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEditing(question.id)}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          ) : hasValue && isEditing ? (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={stopEditing}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  stopEditing();
                  handleSave();
                }}
                className="h-8 w-8 p-0"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingField(null);
                  handleSave();
                }}
                className="h-8 w-8 p-0"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {renderInput()}
        {!hasValue && (
          <p className="text-xs text-yellow-700 mt-1">
            This question hasn't been answered yet. Fill it out above and click save.
          </p>
        )}
      </div>
    );
  };

  const getSectionTitle = (sectionKey: string) => {
    const titles: { [key: string]: string } = {
      'basic_info': 'Basic Information',
      'education_experience': 'Education & Experience',
      'career_goals': 'Career Goals',
      'additional_info': 'Additional Information',
      'us_specific': 'US Specific Questions',
      'uae_specific': 'UAE Specific Questions',
      'eu_specific': 'EU Specific Questions'
    };
    return titles[sectionKey] || sectionKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCompletionPercentage = () => {
    const totalQuestions = Object.values(onboardingQuestions).flat().length;
    const answeredQuestions = Object.values(onboardingQuestions).flat().filter(
      question => {
        const value = onboardingData[question.id];
        return value !== undefined && value !== '' && value !== null;
      }
    ).length;
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  };

  const getUnansweredQuestions = () => {
    return Object.values(onboardingQuestions).flat().filter(
      question => {
        const value = onboardingData[question.id];
        return value === undefined || value === '' || value === null;
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Onboarding Answers</h1>
          <p className="text-gray-600">Update your responses to onboarding questions</p>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm text-gray-500">{getCompletionPercentage()}%</span>
            </div>
            <Progress value={getCompletionPercentage()} className="mb-2" />
            <p className="text-xs text-gray-600">
              {Object.values(onboardingQuestions).flat().filter(
                question => {
                  const value = onboardingData[question.id];
                  return value !== undefined && value !== '' && value !== null;
                }
              ).length} of {Object.values(onboardingQuestions).flat().length} questions answered
            </p>
            {getUnansweredQuestions().length > 0 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  {getUnansweredQuestions().length} questions still need to be answered
                </p>
                <p className="text-xs text-yellow-700">
                  Questions with yellow backgrounds below are waiting for your input.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {Object.keys(onboardingQuestions).map((sectionKey) => (
                    <button
                      key={sectionKey}
                      onClick={() => setActiveSection(sectionKey)}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                        activeSection === sectionKey
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {getSectionTitle(sectionKey)}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{getSectionTitle(activeSection)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {onboardingQuestions[activeSection]?.map((question) => (
                  <div key={question.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    {renderField(question)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;