import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const API_URL = '/api/cv-generator';

// Get CV data from backend
export const getCvData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching CV data:', error);
    throw error;
  }
};

// Update user CV information
export const updateCvInfo = async (cvInfo) => {
  try {
    const response = await axios.put(API_URL, cvInfo);
    return response.data;
  } catch (error) {
    console.error('Error updating CV information:', error);
    throw error;
  }
};

// Generate and download PDF CV
export const generatePdfCV = async (cvData) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add title
    doc.setFontSize(24);
    doc.setTextColor(63, 81, 181); // Primary color
    doc.text('Academic CV', pageWidth / 2, 20, { align: 'center' });
    
    // Add user info
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`, pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(119, 119, 119);
    doc.text(cvData.personalInfo.email, pageWidth / 2, 35, { align: 'center' });
    doc.text(cvData.personalInfo.phone || '', pageWidth / 2, 40, { align: 'center' });
    
    // Add profile
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Profile', 14, 50);
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    
    const profileText = doc.splitTextToSize(cvData.profile || '', pageWidth - 30);
    doc.text(profileText, 14, 55);
    
    let yPosition = 55 + (profileText.length * 5);
    
    // Add education
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Education', 14, yPosition + 10);
    
    yPosition += 15;
    
    if (cvData.education && cvData.education.length > 0) {
      cvData.education.forEach(edu => {
        doc.setFontSize(10);
        doc.setTextColor(63, 81, 181);
        doc.text(edu.institution, 14, yPosition);
        
        doc.setTextColor(119, 119, 119);
        doc.text(`${edu.degree} - ${edu.field}`, 14, yPosition + 5);
        doc.text(`${edu.startDate} - ${edu.endDate || 'Present'}`, 14, yPosition + 10);
        
        yPosition += 15;
      });
    }
    
    // Add skills and competencies
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Skills & Competencies', 14, yPosition + 5);
    
    yPosition += 10;
    
    // Add skills table
    if (cvData.skills && cvData.skills.length > 0) {
      const skillsData = [];
      
      cvData.skills.forEach(skill => {
        skillsData.push([skill.name, `${skill.proficiency}%`]);
      });
      
      doc.autoTable({
        startY: yPosition,
        head: [['Skill', 'Proficiency']],
        body: skillsData,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] },
        margin: { left: 14, right: 14 },
      });
      
      yPosition = doc.lastAutoTable.finalY + 10;
    }
    
    // Add achievements
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Achievements', 14, yPosition);
    
    yPosition += 5;
    
    if (cvData.achievements && cvData.achievements.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);
      
      cvData.achievements.forEach(achievement => {
        const achievementText = doc.splitTextToSize(`• ${achievement.title} - ${achievement.description}`, pageWidth - 30);
        doc.text(achievementText, 14, yPosition + 5);
        yPosition += (achievementText.length * 5) + 5;
      });
    }
    
    // Save the PDF
    doc.save('academic_cv.pdf');
    return { success: true };
  } catch (error) {
    console.error('Error generating PDF CV:', error);
    throw error;
  }
};

// Export CV as JSON (for importing to other systems)
export const exportCvAsJson = (cvData) => {
  try {
    const dataStr = JSON.stringify(cvData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'academic_cv.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting CV as JSON:', error);
    throw error;
  }
}; 