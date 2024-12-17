import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';

const CaseStudyReader = () => {
  const caseStudyContent = `Describe:
The daily steps tracking feature offers users an effortless way to monitor their
physical activity. It gives users insights into their daily mobility, potentially
encouraging them to move more. The feature also allows Apple Health to
understand a user's physical activity patterns better, enhancing the app's ability to
offer personalized health suggestions.

Apple Health Landscape:
The global market for health apps was valued at $56.26 billion in 2022 and is
projected to reach $861.40 billion by 2030, a CAGR of 40.2% from 2023 to 2030.
North America has the largest share of the global market at 30.48%. The market is
expanding due to the introduction of telehealth and remote monitoring.

Future Goals:
High level goals:
1. Improve Public Health Outcomes.
2. Enhance User Trust and Privacy.
3. Drive Long-Term Engagement and Retention.

Low level goals:
1. Improve User Interface and Experience.
2. Personalise Health Insights and Recommendations.
3. Enhance Data Visualization and Reporting.`;

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.includes(':')) {
        const [title, ...rest] = paragraph.split(':');
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">{title}:</h3>
            <div className="whitespace-pre-line text-gray-300">
              {rest.join(':')}
            </div>
          </div>
        );
      }
      return (
        <p key={index} className="mb-4 text-gray-300 whitespace-pre-line">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
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
              <CardTitle className="text-gray-200">Case Study: Apple Health Steps Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            {formatContent(caseStudyContent)}
          </CardContent>
        </Card>
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={() => console.log('Generate new case study')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Generate New Case Study
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyReader;