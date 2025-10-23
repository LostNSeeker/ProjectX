import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface OnboardingData {
  [key: string]: any;
}

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({});
  const [questions, setQuestions] = useState<{ [key: string]: Question[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);

  const steps = [
    { id: 'basic_info', title: 'Basic Information', icon: '👤' },
    { id: 'education_experience', title: 'Education & Experience', icon: '🎓' },
    { id: 'career_goals', title: 'Career Goals', icon: '🎯' },
    { id: 'additional_info', title: 'Additional Information', icon: '📝' },
    { id: 'us_specific', title: 'US-Specific Questions', icon: '🇺🇸' },
    { id: 'uae_specific', title: 'UAE-Specific Questions', icon: '🇦🇪' },
    { id: 'eu_specific', title: 'EU-Specific Questions', icon: '🇪🇺' },
    { id: 'cv_upload', title: 'CV Upload', icon: '📄' }
  ];

  useEffect(() => {
    fetchQuestions();
    fetchExistingData();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/onboarding/questions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchExistingData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/onboarding/get', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setFormData(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching existing data:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/onboarding/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save data');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCvUpload = async () => {
    if (!cvFile) return;

    setCvUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('cv_file', cvFile);

      const response = await fetch('http://localhost:8001/api/cv/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setCvUploaded(true);
        const data = await response.json();
        console.log('CV parsed data:', data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to upload CV');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setCvUploading(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const value = formData[question.id] || '';

    switch (question.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>
              {question.question} {question.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={question.id}
              type={question.type}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>
              {question.question} {question.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={question.id}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              rows={4}
            />
          </div>
        );

      case 'select':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>
              {question.question} {question.required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleInputChange(question.id, val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'boolean':
        return (
          <div key={question.id} className="flex items-center space-x-2">
            <Checkbox
              id={question.id}
              checked={value}
              onCheckedChange={(checked) => handleInputChange(question.id, checked)}
            />
            <Label htmlFor={question.id}>
              {question.question} {question.required && <span className="text-red-500">*</span>}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepContent = () => {
    const currentStepId = steps[currentStep].id;
    const stepQuestions = questions[currentStepId] || [];

    if (currentStepId === 'cv_upload') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Upload Your CV</h3>
            <p className="text-gray-600">
              Upload your CV and we'll automatically extract important information using AI
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              className="hidden"
              id="cv-upload"
            />
            <label htmlFor="cv-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Choose CV File</p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX, TXT, PNG, JPG, JPEG
              </p>
            </label>
          </div>

          {cvFile && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Selected file: {cvFile.name}</p>
              <p className="text-sm text-gray-500">
                Size: {(cvFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          <Button
            onClick={handleCvUpload}
            disabled={!cvFile || cvUploading}
            className="w-full"
          >
            {cvUploading ? 'Uploading...' : 'Upload & Parse CV'}
          </Button>

          {cvUploaded && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>CV uploaded and parsed successfully!</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {stepQuestions.map(renderQuestion)}
      </div>
    );
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-4">Onboarding Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your profile has been successfully created. You can now use the browser extension
              to automatically fill job application forms.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">
              {steps[currentStep].icon} {steps[currentStep].title}
            </CardTitle>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center space-x-2 text-red-600 mb-4 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Progress'}
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Completing...' : 'Complete Onboarding'}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;