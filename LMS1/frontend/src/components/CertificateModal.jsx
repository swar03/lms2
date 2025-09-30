import React from 'react';
import Certificate from './Certificate';

const CertificateModal = ({ course, user, onClose }) => {
  const handlePrint = () => {
    const printContents = document.getElementById('certificate-print-area').innerHTML;
    const originalContents = document.body.innerHTML;
    
    // Create a temporary iframe to load TailwindCSS for print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            /* Ensure the certificate is centered and takes full print page */
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            #certificate-print-area { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
            #certificate { transform: scale(0.95); /* Adjust scale for print fit */ }
            /* Hide buttons/modal background for print */
            .no-print { display: none !important; }
          </style>
        </head>
        <body>
          <div id="certificate-print-area">${printContents}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Wait for Tailwind to load and apply styles before printing
    printWindow.onload = () => {
      setTimeout(() => { // Give a little extra time for styles to render
        printWindow.print();
        printWindow.close();
      }, 500); 
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center mb-4 animate-slide-up">
        <h2 className="text-3xl font-bold text-green-400">Congratulations!</h2>
        <p className="text-lg mt-2 text-gray-300">You have successfully completed the course.</p>
      </div>

      <div id="certificate-print-area" className="animate-fade-in-late">
        <Certificate
          courseTitle={course.title}
          studentName={user.name}
          completionDate={new Date().toLocaleDateString()}
        />
      </div>

      <div className="mt-6 flex space-x-4 animate-slide-up-late no-print">
        <button onClick={onClose} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors">Close</button>
        <button onClick={handlePrint} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-500 transition-colors">
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default CertificateModal;