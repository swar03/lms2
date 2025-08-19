import React, { useState } from 'react';

// --- Helper Data ---
// In a real application, this data would likely come from an API.
const curriculumData = [
  {
    id: 1,
    title: 'Computer & OS Fundamentals',
    items: [
      { id: 'c1', type: 'Video', url: '#' },
      { id: 'c2', type: 'Assignment - 1', url: '#' },
      { id: 'c3', type: 'Quiz', url: '#' },
      { id: 'c4', type: 'Feedback', url: '#' },
    ],
  },
  {
    id: 2,
    title: 'Network Fundamentals',
    items: [
      { id: 'n1', type: 'Video', url: '#' },
      { id: 'n2', type: 'Assignment-2', url: '#' },
      { id: 'n3', type: 'Quiz', url: '#' },
      { id: 'n4', type: 'Feedback', url: '#' },
    ],
  },
];

// --- SVG Icons ---
// Using inline SVGs to avoid external dependencies.

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green-500"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const ChevronDownIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );


// --- Reusable Accordion Component ---
const AccordionItem = ({ section, isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
      {/* Header to toggle the accordion */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
          <p className="text-sm text-gray-500">{section.items.length} items</p>
        </div>
        <span className="transform transition-transform duration-300">
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      </button>

      {/* Content that expands/collapses */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 border-t border-gray-200">
          {section.items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="flex items-center p-3 mb-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <LinkIcon />
              </div>
              <div>
                <p className="font-medium text-gray-700">{item.type}</p>
                <p className="text-sm text-gray-500">URL</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- Main Curriculum Page Component ---
const Curriculum = () => {
  // State to track which accordion item is open. `null` means all are closed.
  const [openSectionId, setOpenSectionId] = useState(curriculumData[0]?.id || null);

  // Function to handle toggling accordion items
  const handleToggle = (sectionId) => {
    setOpenSectionId(prevId => (prevId === sectionId ? null : sectionId));
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 max-w-2xl">
        {/* Map over the curriculum data to render each section */}
        {curriculumData.map((section) => (
          <AccordionItem
            key={section.id}
            section={section}
            isOpen={openSectionId === section.id}
            onToggle={() => handleToggle(section.id)}
          />
        ))}
      </div>

      {/* Floating "Get for free" button at the bottom */}
      
    </div>
  );
};


// --- Main App Component ---
// This is the root of your application.
export default function App() {
  // For this example, we'll render the Curriculum page directly.
  // In your full app, you would use your router setup.
  return <Curriculum />;
}
