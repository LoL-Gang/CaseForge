import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';

const CaseStudyReader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve data stored in sessionStorage
  const data = JSON.parse(sessionStorage.getItem('caseStudyData') || '{}');
  
  const formatContent = (content: string) => {
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*/g, '→');

    return formatted.split('\n\n').map((paragraph, index) => (
      <div key={index} className="mb-4 text-gray-300 whitespace-pre-line left-aligned-text"
           dangerouslySetInnerHTML={{ __html: paragraph }}>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            onClick={() => window.history.back()}
            variant="ghost" 
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-gray-400" />
              <CardTitle className="text-gray-200">Case Study: {data.metadata?.parameters?.industry}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none left-aligned-text">
            {formatContent(data.case_study)}
            <div>
              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-200">Questions and Answers:</h3>
              {data.questions_and_answers?.map((qa, index) => (
                <div key={index}>
                  <p className="text-lg font-semibold text-gray-200">Q: {qa.question}</p>
                  <p className="text-gray-300">A: {qa.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseStudyReader;
