/**
 * PDF Service Module
 * Handles PDF file processing and text extraction
 * Note: This is a simplified version - in a real app, you'd use a proper PDF parsing library
 */

/**
 * Extracts text content from an uploaded PDF file
 * @param {File} file - The uploaded PDF file
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // In a real implementation, you would use a library like pdf-parse or PDF.js
        // For now, we'll simulate text extraction
        const arrayBuffer = e.target.result;
        
        // This is a placeholder - in reality you'd parse the PDF binary data
        // For demonstration, we'll return a message indicating the file was processed
        const simulatedText = `
        [PDF Content Extracted]
        
        This is a simulated text extraction from the uploaded PDF file: ${file.name}
        
        In a production environment, this would contain the actual text content from your PDF resume.
        The text would include sections like:
        - Personal Information
        - Professional Summary
        - Work Experience
        - Education
        - Skills
        - Certifications
        - Projects
        
        File size: ${(file.size / 1024).toFixed(2)} KB
        File type: ${file.type}
        
        Note: To implement actual PDF text extraction, you would need to integrate a PDF parsing library like:
        - pdf-parse (Node.js)
        - PDF.js (Browser-based)
        - react-pdf
        `;
        
        resolve(simulatedText);
      } catch (error) {
        reject(new Error(`Failed to extract text from PDF: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Validates if the uploaded file is a valid PDF
 * @param {File} file - The file to validate
 * @returns {boolean} - True if valid PDF, false otherwise
 */
export const validatePDFFile = (file) => {
  // Check file type
  if (file.type !== 'application/pdf') {
    return false;
  }
  
  // Check file size (limit to 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return false;
  }
  
  return true;
};

/**
 * Gets file information for display
 * @param {File} file - The file to get info for
 * @returns {Object} - File information object
 */
export const getFileInfo = (file) => {
  return {
    name: file.name,
    size: (file.size / 1024).toFixed(2) + ' KB',
    type: file.type,
    lastModified: new Date(file.lastModified).toLocaleDateString()
  };
};