import React, { useState } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

const FormScreen = () => {
  const [formData, setFormData] = useState({
    interviewRole: '',
    industry: '',
    customInterviewRole: '', // For custom input of interview role
    customIndustry: '', // For custom input of industry
    difficulty: 'Medium', // Default as per the document
    timeConstraint: 'No Time Limit', // Default as per the document
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const roleOptions = [
    { value: 'Product Manager', label: 'Product Manager' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Strategy Consultant', label: 'Strategy Consultant' },
    { value: 'Business Analyst', label: 'Business Analyst' },
    { value: 'Operations Manager', label: 'Operations Manager' },
    { value: 'Growth Manager', label: 'Growth Manager' },
    { value: 'Marketing Manager', label: 'Marketing Manager' },
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'Product Designer', label: 'Product Designer' },
    { value: 'General Management', label: 'General Management' },
    { value: 'Other', label: 'Other' }, // User can enter a custom role
  ];

  const industryOptions = [
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Retail & FMCG', label: 'Retail & FMCG' },
    { value: 'FinTech', label: 'FinTech' },
    { value: 'EdTech', label: 'EdTech' },
    { value: 'Food Delivery', label: 'Food Delivery' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'IT Services', label: 'IT Services' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Logistics & Supply Chain', label: 'Logistics & Supply Chain' },
    { value: 'Media & Entertainment', label: 'Media & Entertainment' },
    { value: 'Hospitality', label: 'Hospitality' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Government & Public Sector', label: 'Government & Public Sector' },
    { value: 'Telecommunications', label: 'Telecommunications' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Other', label: 'Other' }, // User can enter a custom industry
  ];

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  interface FormData {
    interviewRole: string;
    industry: string;
    customInterviewRole: string;
    customIndustry: string;
    difficulty: string;
    timeConstraint: string;
  }

  interface Option {
    value: string;
    label: string;
  }

  const handleCustomInput = (option: string, value: string) => {
    // If "Other" is selected, set the custom field
    const key = `custom${option.charAt(0).toUpperCase() + option.slice(1)}`; // Custom key for state
    handleInputChange(key as keyof FormData, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.log('Case study generated:', formData);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            CaseForge
          </motion.h1>
          <motion.p
            className="text-xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Craft precision-engineered case studies for deep learning
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            options={roleOptions}
            className="text-black"
            placeholder="Select Interview Role"
            onChange={(option) => {
              if (option) {
                handleInputChange('interviewRole', option.value);
                if (option.value === 'Other') {
                  handleCustomInput('interviewRole', ''); // Reset custom role when 'Other' is selected
                }
              }
            }}
          />
          {formData.interviewRole === 'Other' && (
            <input
              type="text"
              value={formData.customInterviewRole}
              onChange={(e) => handleCustomInput('interviewRole', e.target.value)}
              placeholder="Enter your custom role"
              className="text-black p-2 rounded border"
            />
          )}

          <Select
            options={industryOptions}
            className="text-black"
            placeholder="Select Industry"
            onChange={(option) => {
              if (option) {
                handleInputChange('industry', option.value);
                if (option.value === 'Other') {
                  handleCustomInput('industry', ''); // Reset custom industry when 'Other' is selected
                }
              }
            }}
               
          />
          {formData.industry === 'Other' && (
            <input
              type="text"
              value={formData.customIndustry}
              onChange={(e) => handleCustomInput('industry', e.target.value)}
              placeholder="Enter your custom industry"
              className="text-black p-2 rounded border"
            />
          )}

          <div className="flex flex-col gap-2">
            <label>
              Difficulty Level:
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="ml-2"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
            <label>
              Time Constraint:
              <select
                value={formData.timeConstraint}
                onChange={(e) => handleInputChange('timeConstraint', e.target.value)}
                className="ml-2"
              >
                <option value="No Time Limit">No Time Limit</option>
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="60 minutes">60 minutes</option>
                <option value="Custom">Custom</option>
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Generating Your Case Study...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate My Case
              </span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default FormScreen;
