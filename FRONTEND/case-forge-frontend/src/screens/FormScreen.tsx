import React, { useState, ChangeEvent, FormEvent } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



interface OptionType {
  value: string;
  label: string;
}

interface FormData {
  interviewRole: string;
  industry: string;
  customInterviewRole: string;
  customIndustry: string;
  difficulty: string;
  timeConstraint: string;
  userSpecifications: string;
}

const FormScreen = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    interviewRole: '',
    industry: '',
    customInterviewRole: '',
    customIndustry: '',
    difficulty: 'Medium', // Default as per the document
    timeConstraint: 'No Time Limit', // Default as per the document
    userSpecifications: '' // New field for additional user specifications
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const roleOptions: OptionType[] = [
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
    { value: 'Other', label: 'Other' }
  ];

  const industryOptions: OptionType[] = [
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
    { value: 'Other', label: 'Other' }
  ];

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCustomInput = (option: string, value: string) => {
    const key = `custom${option.charAt(0).toUpperCase() + option.slice(1)}` as keyof FormData; 
    handleInputChange(key, value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsGenerating(true); // Set loading state
  
    try {
      // Send POST request to the server with formData
      const response = await axios.post('http://127.0.0.1:5000/generate', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // const CaseStudyContent = {
      //   "case_study": "**Case Study: Condoms**\n\n**1. Background & Context**\n\n**Company Description:**\nCondomCo is a leading manufacturer of condoms and related products. With a market share of 25%, the company has established itself as a trusted brand in the condom industry.\n\n**Current Market Dynamics:**\nThe global condom market is expected to grow at a CAGR of 4.5% from 2023 to 2030. Increasing awareness about sexually transmitted diseases (STDs) and unplanned pregnancies, along with government initiatives promoting safe sex practices, are driving market growth.\n\n**Key Challenges:**\n* Intense competition from both established and emerging brands\n* Fluctuating raw material prices\n* Changing consumer preferences towards natural and sustainable products\n\n**2. Problem Statement**\n\n**Main Problem:**\nDespite its market leadership, CondomCo has been losing market share to competitors due to a lack of innovation in its product line. The company's condoms are perceived as basic and outdated, failing to meet the evolving needs of consumers.\n\n**Stakeholders Involved:**\n* CondomCo management\n* Shareholders\n* Customers\n* Distributors\n\n**Expected Business Impact:**\nContinued loss of market share could lead to reduced revenue, profitability, and brand reputation.\n\n**3. Data & Constraints**\n\n**Data Availability and Key Metrics:**\n* Market share data\n* Sales figures\n* Consumer surveys\n* Raw material price fluctuations\n\n**Technical Constraints:**\n* Limited production capacity\n* Regulatory requirements for condom manufacturing\n\n**Budget and Resource Limitations:**\n* Limited R&D budget\n* Scarcity of skilled labor\n\n**Timeline Implications:**\n* Need to launch new products within the next 6 months to maintain market position\n\n**4. Proposed Solution**\n\n**Strategies and Approaches:**\n\n* **Product Innovation:** Develop a range of new condoms with unique features and benefits, such as enhanced sensitivity, long-lasting lubrication, and natural materials.\n* **Market Segmentation:** Target specific customer segments with tailored condom products, addressing their specific needs and preferences.\n* **Brand Differentiation:** Emphasize the unique selling points of CondomCo's condoms through creative marketing campaigns.\n* **Strategic Partnerships:** Collaborate with healthcare organizations and retailers to promote the importance of condom use and distribute CondomCo products.\n\n**Evaluation of Trade-Offs:**\n\n* **Cost vs. Quality:** Balancing the need for affordability with the desire to produce high-quality condoms.\n* **Innovation vs. Market Acceptance:** Ensuring that new products are both innovative and appealing to consumers.\n* **Speed to Market vs. Product Development Time:** Prioritizing speed to market while maintaining product quality standards.\n\n**Key Success Metrics:**\n\n* Increased market share\n* Improved customer satisfaction\n* Enhanced brand reputation\n\n**5. Implementation Plan**\n\n**Timeline:**\n\n* **Month 1-3:** Conduct market research, develop product concepts, and secure funding.\n* **Month 4-6:** Finalize product designs, initiate production, and launch new products.\n* **Month 7-12:** Monitor product performance, adjust marketing strategies, and seek feedback from customers.\n\n**Resources Allocation:**\n\n* R&D team: 5 engineers and 2 designers\n* Marketing team: 3 marketing managers and 4 content creators\n* Production team: 10 skilled workers and 2 supervisors\n\n**Risk Management Strategies:**\n\n* **Production Delays:** Establish contingency plans for potential production delays due to raw material shortages or technical issues.\n* **Market Acceptance:** Conduct thorough market testing and gather consumer feedback to minimize the risk of product rejection.\n* **Competition:** Monitor competitor activity and adjust product offerings and marketing strategies accordingly.",
      //   "metadata": {
      //     "case_study_length": 3791,
      //     "generated_at": "2024-12-20T18:20:31.704071",
      //     "num_qa_pairs": 5,
      //     "parameters": {
      //       "difficulty": "easy",
      //       "focus_area": "Product Strategy",
      //       "industry": "condoms",
      //       "role": ""
      //     }
      //   },
      //   "questions_and_answers": [
      //     {
      //       "answer": "CondomCo faces intense competition, fluctuating raw material prices, and changing consumer preferences. To address these challenges, the company should focus on product innovation, market segmentation, brand differentiation, and strategic partnerships. By introducing new condoms with unique features, targeting specific customer segments, emphasizing its unique selling points, and collaborating with healthcare organizations and retailers, CondomCo can strengthen its market position and mitigate the impact of competition and market changes.",
      //       "question": "What are the key strategic challenges facing CondomCo and how should the company address them?"
      //     },
      //     {
      //       "answer": "To balance cost-effectiveness with quality, CondomCo should explore cost-saving measures in areas such as manufacturing efficiency, supply chain optimization, and raw material sourcing. The company should also consider investing in research and development to create innovative condoms that offer both quality and value for money. Additionally, CondomCo can negotiate with suppliers to secure favorable pricing while maintaining quality standards through stringent testing and quality control processes.",
      //       "question": "How can CondomCo balance the need for cost-effectiveness with the desire to produce high-quality condoms?"
      //     },
      //     {
      //       "answer": "CondomCo's product innovation strategy carries risks such as production delays, market acceptance, and competition. To mitigate these risks, the company should establish contingency plans for production delays, conduct thorough market testing to minimize the risk of product rejection, and continuously monitor competitor activity to adjust its product offerings and marketing strategies accordingly. Additionally, CondomCo should seek feedback from customers and industry experts to ensure that its new products meet market needs and expectations.",
      //       "question": "What are the potential risks associated with CondomCo's product innovation strategy and how can the company mitigate them?"
      //     },
      //     {
      //       "answer": "To effectively allocate its resources, CondomCo should prioritize tasks based on their importance and urgency. The company should assign skilled engineers and designers to the R&D team, experienced marketing managers and content creators to the marketing team, and skilled workers and supervisors to the production team. CondomCo should also consider outsourcing non-core functions to optimize resource allocation and focus on its core competencies.",
      //       "question": "How can CondomCo effectively allocate its resources to ensure the successful implementation of its product innovation plan?"
      //     },
      //     {
      //       "answer": "To measure the success of its product innovation strategy, CondomCo should track KPIs such as increased market share, improved customer satisfaction, and enhanced brand reputation. The company should also monitor sales figures for new products, conduct customer surveys to gauge satisfaction, and analyze brand mentions and sentiment in social media and online reviews to assess brand reputation. By tracking these KPIs, CondomCo can evaluate the effectiveness of its product innovation strategy and make adjustments as needed.",
      //       "question": "What are the key performance indicators (KPIs) that CondomCo should track to measure the success of its product innovation strategy?"
      //     }
      //   ]
      // };
      sessionStorage.setItem('caseStudyData', JSON.stringify(response.data));
navigate('/case-study');
      // navigate('/case-study', { state: { caseStudyContent: CaseStudyContent } });
      console.log('Case study generated succesfully.'); // Log the response from the server
 // Alert user of success
    } catch (error) {
      console.error('Error generating case study:', error); // Log any errors
      alert('Failed to generate case study.'); // Alert user of failure
    }
  
    setIsGenerating(false); // Reset loading state
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
            onChange={(option: OptionType | null) => {
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleCustomInput('interviewRole', e.target.value)}
              placeholder="Enter your custom role"
              className="text-black p-2 rounded border"
            />
          )}

          <Select
            options={industryOptions}
            className="text-black"
            placeholder="Select Industry"
            onChange={(option: OptionType | null) => {
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleCustomInput('industry', e.target.value)}
              placeholder="Enter your custom industry"
              className="text-black p-2 rounded border"
            />
          )}

          <div className="flex flex-col gap-2">
            <label>
              Difficulty Level:
              <select
                value={formData.difficulty}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('difficulty', e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('timeConstraint', e.target.value)}
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

          <textarea
            className="w-full p-2 text-black rounded border"
            placeholder="User Specifications (optional)"
            value={formData.userSpecifications}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('userSpecifications', e.target.value)}
          />

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
