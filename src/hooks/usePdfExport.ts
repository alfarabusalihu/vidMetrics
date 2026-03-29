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
    let cursorY = 30;

    // Helper: Add Text
    const addText = (text: string, x: number, y: number, size = 10, style = 'normal', color = '#000000') => {
      doc.setFontSize(size);
      doc.setTextColor(color);
      doc.setFont('helvetica', style);
      doc.text(text, x, y);
    };

    try {
      toast.loading('Preparing Brand Brief...');

      // Title & Branding
      addText('VidMetrics | Strategic Brand Brief', margin, cursorY, 22, 'bold', '#0ea5e9');
      cursorY += 15;
      
      addText(`Report for: ${result.channel.title}`, margin, cursorY, 14, 'bold');
      cursorY += 10;
      
      addText(`Generated on: ${new Date().toLocaleDateString()}`, margin, cursorY, 8, 'normal', '#666666');
      cursorY += 20;

      // 1. Channel Statistics
      addText('1. CHANNEL CORE METRICS', margin, cursorY, 12, 'bold');
      cursorY += 10;
      
      const stats = [
        `Subscribers: ${parseInt(result.channel.statistics.subscriberCount).toLocaleString()}`,
        `Median Views (6mo): ${result.medianViews.toLocaleString()}`,
        `Efficiency Score: ${result.channel.score}%`,
        `Potential Monthly Value: ${aiReport.revenueEstimate || 'Premium'}`
      ];
      
      stats.forEach(stat => {
        addText(`• ${stat}`, margin + 5, cursorY, 10);
        cursorY += 7;
      });
      cursorY += 15;

      // 2. AI Strategic Summary
      addText('2. AI STRATEGIC ANALYSIS', margin, cursorY, 12, 'bold');
      cursorY += 10;
      
      addText('Market Positioning:', margin + 5, cursorY, 10, 'bold');
      cursorY += 6;
      const posLines = doc.splitTextToSize(aiReport.marketPosition, pageWidth - margin * 2 - 10);
      doc.text(posLines, margin + 5, cursorY);
      cursorY += posLines.length * 6 + 4;

      addText('Strategic Health Summary:', margin + 5, cursorY, 10, 'bold');
      cursorY += 6;
      const sumLines = doc.splitTextToSize(aiReport.summary, pageWidth - margin * 2 - 10);
      doc.text(sumLines, margin + 5, cursorY);
      cursorY += sumLines.length * 6 + 15;

      // 3. Action Items
      addText('3. PRIORITY ACTION ITEMS', margin, cursorY, 12, 'bold');
      cursorY += 10;
      
      aiReport.improvements.forEach((item: string, i: number) => {
        const itemLines = doc.splitTextToSize(`${i + 1}. ${item}`, pageWidth - margin * 2 - 10);
        doc.text(itemLines, margin + 5, cursorY);
        cursorY += itemLines.length * 6 + 4;
      });

      // Footer
      cursorY = doc.internal.pageSize.getHeight() - 20;
      doc.setDrawColor('#0ea5e9');
      doc.line(margin, cursorY - 5, pageWidth - margin, cursorY - 5);
      addText('Confidential Competitive Intelligence by VidMetrics 3.0', margin, cursorY, 8, 'italic', '#999999');

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
