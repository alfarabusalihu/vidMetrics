'use client';

import jsPDF from 'jspdf';
import { AnalysisResult } from '@/types/youtube';
import { toast } from 'sonner';

export function usePdfExport() {
  const exportChannelReport = async (result: AnalysisResult, aiReport: { summary: string; marketPosition: string; revenueEstimate: string; improvements: string[] }) => {
    if (!result || !aiReport) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxUseableY = pageHeight - margin - 15; // Space for footer
    let cursorY = 30;

    const checkPageBreak = (neededSpace = 10) => {
      if (cursorY + neededSpace > maxUseableY) {
        doc.addPage();
        cursorY = margin + 10;
        return true;
      }
      return false;
    };

    const addText = (text: string, x: number, y: number, size = 10, style = 'normal', color = '#000000') => {
      doc.setFontSize(size);
      doc.setTextColor(color);
      doc.setFont('helvetica', style);
      doc.text(text, x, y);
    };

    const printParagraph = (text: string, x: number, size = 10, style = 'normal', color = '#000000', lineHeightOffset = 6) => {
      doc.setFontSize(size);
      doc.setTextColor(color);
      doc.setFont('helvetica', style);
      
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - (x - margin));
      
      lines.forEach((line: string) => {
        checkPageBreak(lineHeightOffset);
        doc.text(line, x, cursorY);
        cursorY += lineHeightOffset;
      });
    };

    try {
      toast.loading('Preparing Brand Brief...');

      // --- PAGE 1: Branding & Market Pos ---
      // Header
      addText('VidMetrics | Strategic Brand Brief', margin, cursorY, 22, 'bold', '#0ea5e9');
      cursorY += 15;
      
      addText(`Report for: ${result.channel.title}`, margin, cursorY, 14, 'bold');
      cursorY += 8;
      
      addText(`Generated on: ${new Date().toLocaleDateString()}`, margin, cursorY, 9, 'normal', '#666666');
      cursorY += 20;

      // 1. Core Metrics
      addText('1. CHANNEL CORE METRICS', margin, cursorY, 12, 'bold');
      cursorY += 10;
      
      const stats = [
        `Subscribers: ${parseInt(result.channel.statistics.subscriberCount).toLocaleString()}`,
        `Median Views (6mo): ${result.medianViews.toLocaleString()}`,
        `Efficiency Score: ${result.channel.score}%`,
        `Potential Monthly Value: ${aiReport.revenueEstimate || 'Premium'}`
      ];
      
      stats.forEach(stat => {
        printParagraph(`• ${stat}`, margin + 5, 11, 'normal', '#333333', 7);
      });
      cursorY += 10;

      // 2. Market Positioning
      checkPageBreak(20);
      addText('2. MARKET POSITIONING & HEALTH', margin, cursorY, 12, 'bold');
      cursorY += 10;

      addText('Positioning Overview:', margin + 5, cursorY, 11, 'bold');
      cursorY += 8;
      printParagraph(aiReport.marketPosition, margin + 5, 10, 'normal', '#444444', 6);
      cursorY += 8;

      checkPageBreak(25);
      addText('Strategic Health Summary:', margin + 5, cursorY, 11, 'bold');
      cursorY += 8;
      printParagraph(aiReport.summary, margin + 5, 10, 'normal', '#444444', 6);
      
      // Force Page 2 for Action Items to make it multi-page and un-cluttered
      doc.addPage();
      cursorY = margin + 15;

      // --- PAGE 2: Action Items ---
      addText('3. PRIORITY ACTION ITEMS', margin, cursorY, 12, 'bold');
      cursorY += 12;
      
      aiReport.improvements.forEach((item: string, i: number) => {
        checkPageBreak(25);
        printParagraph(`${i + 1}. ${item}`, margin + 5, 10, 'normal', '#444444', 6);
        cursorY += 6; // Padding between items
      });

      // Add footers across all generated pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const footerY = pageHeight - 15;
        doc.setDrawColor('#0ea5e9');
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
        addText('Confidential Competitive Intelligence by VidMetrics 3.0', margin, footerY, 8, 'italic', '#999999');
        
        // Page Number
        addText(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, footerY, 8, 'normal', '#999999');
      }

      doc.save(`VidMetrics_Report_${result.channel.title.replace(/\s+/g, '_')}.pdf`);
      toast.dismiss();
      toast.success('Report Downloaded Successfully');
    } catch (err) {
      console.error('PDF Export Error:', err);
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  return { exportChannelReport };
}
