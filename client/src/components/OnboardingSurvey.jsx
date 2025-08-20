// src/components/OnboardingSurvey.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const surveyQuestions = [
  // ... Keep your surveyQuestions array as before (from your earlier code)
  {
    id: 'industry',
    question: 'Which industry do you work in?',
    subtitle: 'Help us understand your professional landscape.',
    options: ['Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Technology', 'Marketing & Advertising', 'E-commerce', 'Other (please specify)'],
    type: 'radio'
  },
  {
    id: 'department',
    question: 'Which department do you work in?',
    subtitle: "This helps us tailor features for your team's needs.",
    options: ['Customer Support', 'Human Resources', 'Sales', 'Product Development', 'Research', 'Marketing', 'Finance', 'Data/Analytics', 'Other (please specify)'],
    type: 'radio'
  },
  {
    id: 'analysis_needs',
    question: 'What data analysis needs do you have?',
    subtitle: 'Your answer can better help us carry out targeted iteration plans, thereby providing you with a better data analysis experience.',
    options: ['Bivariate statistical analysis', 'Columns format', 'Rows deduplicate', 'Exploratory data analysis (EDA)', 'Data visualization', 'Statistical data operations', 'Table merge', 'Others'],
    type: 'checkbox'
  },
  {
    id: 'source',
    question: 'How did you first hear about our product?',
    subtitle: 'This information is valuable for our marketing efforts.',
    options: ['Other websites (e.g., blogs, directories, or forums)', 'Referral from a friend or colleague', 'Social Media (e.g., Reddit, Twitter, LinkedIn)', 'Video content (e.g., YouTube, Vimeo)', 'Product review site (e.g., Product Hunt)', 'Search Engine (e.g., Google, Google Ads)', 'Other (please specify)'],
    type: 'radio'
  },
  {
    id: 'other_products',
    question: 'Have you had any exposure to other types of data analysis products recently?',
    subtitle: 'Understanding your experience helps us improve.',
    options: ['Akkio', 'Alteryx Cloud', 'Rows', 'Julius.ai', 'Others', 'None'],
    type: 'checkbox'
  }
];

const SurveyOption = ({ question, option, type, isSelected, onChange }) => {
  const optionId = `${question.id}_${option.replace(/[^a-zA-Z0-9]/g, '_')}`;
  return (
    <label
      htmlFor={optionId}
      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
    >
      <input
        type={type}
        id={optionId}
        name={question.id}
        value={option}
        checked={isSelected}
        onChange={onChange}
        className={`h-4 w-4 ${type === 'radio' ? 'form-radio' : 'form-checkbox'} text-blue-600 border-gray-300 focus:ring-blue-500`}
      />
      <span className="ml-3 text-md font-medium text-gray-800">{option}</span>
    </label>
  );
};

const SurveyStep = ({ question, formData, onDataChange }) => {
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleOptionChange = (e) => {
    const { value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentValues = formData[question.id] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
      onDataChange(question.id, newValues);
    } else {
      onDataChange(question.id, value);
    }

    if (value.toLowerCase().includes('other')) {
      setShowOtherInput(checked || type === 'radio');
    } else if (type === 'radio') {
      const otherOption = question.options.find((opt) => opt.toLowerCase().includes('other'));
      if (formData[question.id] === otherOption) {
        setShowOtherInput(false);
      }
    }
  };

  const handleOtherTextChange = (e) => {
    onDataChange(`${question.id}_other`, e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{question.question}</h2>
      <p className="text-gray-600 mb-6">{question.subtitle}</p>
      <div className="space-y-4">
        {question.options.map((option) => {
          const isSelected =
            question.type === 'checkbox'
              ? (formData[question.id] || []).includes(option)
              : formData[question.id] === option;
          return (
            <SurveyOption
              key={option}
              question={question}
              option={option}
              type={question.type}
              isSelected={isSelected}
              onChange={handleOptionChange}
            />
          );
        })}
      </div>
      {showOtherInput && (
        <div className="mt-4">
          <label htmlFor={`${question.id}-other-input`} className="block text-sm font-medium text-gray-700">
            Please specify:
          </label>
          <input
            type="text"
            id={`${question.id}-other-input`}
            value={formData[`${question.id}_other`] || ''}
            onChange={handleOtherTextChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      )}
      {question.id === 'analysis_needs' && (
        <div className="mt-6">
          <label htmlFor="data-analysis-details" className="block text-sm font-medium text-gray-700">
            Additional details (optional):
          </label>
          <textarea
            id="data-analysis-details"
            name="data-analysis-details"
            rows="4"
            value={formData.analysis_details || ''}
            onChange={e => onDataChange('analysis_details', e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Tell us more about what you want to achieve..."
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default function OnboardingSurvey() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const totalSteps = surveyQuestions.length;
  const navigate = useNavigate();

  const handleDataChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission logic
      console.log('Survey Data:', formData);
      alert('Thank you for your feedback! Redirecting to homepage.');
      navigate('/');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = useMemo(() => (currentStep / totalSteps) * 100, [currentStep, totalSteps]);
  const currentQuestion = surveyQuestions[currentStep - 1];
  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen font-sans">
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 sm:p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      Step {currentStep} of {totalSteps}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                  <div
                    style={{ width: `${progressPercentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>
            {/* Form Content */}
            <div key={currentStep}>
              <SurveyStep
                question={currentQuestion}
                formData={formData}
                onDataChange={handleDataChange}
              />
            </div>
            {/* Navigation Buttons */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out"
              >
                {currentStep === totalSteps ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}