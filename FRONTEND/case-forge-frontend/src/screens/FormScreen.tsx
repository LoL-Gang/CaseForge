import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { BookOpen, Briefcase, Clock, GraduationCap, Zap, Loader2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FormScreen = () => {
  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    industry: '',
    companies: '',
    skills: '',
    softSkills: '',
    interviewRole: '',
    learningObjectives: '',
    timeConstraint: 60,
    difficulty: 'intermediate',
    format: '',
    constraints: '',
    metrics: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState('professional');

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSliderChange = (value: any[]) => {
    setFormData(prevState => ({
      ...prevState,
      timeConstraint: value[0]
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.log('Case study generated:', formData);
    }, 3000);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
          <div className="flex justify-center space-x-4 mb-8">
            {['professional', 'skills', 'parameters'].map((section) => (
              <motion.button
                key={section}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full ${activeSection === section ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSection === 'professional' && (
              <motion.div
                key="professional"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-gray-200">
                      <Briefcase className="mr-2 h-5 w-5" />
                      Professional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      name="role"
                      placeholder="Current Role/Position"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Input
                      name="experience"
                      placeholder="Years of Experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Input
                      name="industry"
                      placeholder="Industry/Domain"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Input
                      name="companies"
                      placeholder="Specific Companies of Interest"
                      value={formData.companies}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'skills' && (
              <motion.div
                key="skills"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-gray-200">
                      <GraduationCap className="mr-2 h-5 w-5" />
                      Skills and Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      name="skills"
                      placeholder="Key Skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Textarea
                      name="softSkills"
                      placeholder="Soft Skills"
                      value={formData.softSkills}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Input
                      name="interviewRole"
                      placeholder="Interview Role"
                      value={formData.interviewRole}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Textarea
                      name="learningObjectives"
                      placeholder="Learning Objectives"
                      value={formData.learningObjectives}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'parameters' && (
              <motion.div
                key="parameters"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-gray-200">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Case Study Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Clock className="text-gray-400 h-5 w-5" />
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-300 mb-1">Time Constraint: {formData.timeConstraint} minutes</p>
                        <Slider
                          defaultValue={[60]}
                          max={180}
                          step={15}
                          onValueChange={handleSliderChange}
                          className="text-blue-500"
                        />
                      </div>
                    </div>
                    <Select onValueChange={(value) => handleSelectChange('difficulty', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                        <SelectValue placeholder="Difficulty Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      name="format"
                      placeholder="Preferred Format"
                      value={formData.format}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Textarea
                      name="constraints"
                      placeholder="Industry-Specific Constraints"
                      value={formData.constraints}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Input
                      name="metrics"
                      placeholder="Case Study Metrics"
                      value={formData.metrics}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Forging Your Case Study...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Forge Case Study
                </span>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default FormScreen;