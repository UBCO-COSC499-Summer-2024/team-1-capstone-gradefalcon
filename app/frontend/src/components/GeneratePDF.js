import { PDFDocument, rgb } from 'pdf-lib';

export const generatePDF = async (data) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([data.pageDimensions[0], data.pageDimensions[1]]);
  const { width, height } = page.getSize();

  // Draw a border if specified
  const borderOptions = data.preProcessors.find(proc => proc.name === 'BorderPreprocessor')?.options;
  if (borderOptions) {
    page.drawRectangle({
      x: borderOptions.border_size / 2,
      y: borderOptions.border_size / 2,
      width: width - borderOptions.border_size,
      height: height - borderOptions.border_size,
      borderColor: rgb(borderOptions.border_color[0] / 255, borderOptions.border_color[1] / 255, borderOptions.border_color[2] / 255),
      borderWidth: borderOptions.border_size,
    });
  }

  // Draw the bubble blocks
  Object.keys(data.fieldBlocks).forEach(blockName => {
    const block = data.fieldBlocks[blockName];
    const { origin, fieldLabels, bubblesGap, labelsGap } = block;
    const bubbleSize = data.bubbleDimensions[0];

    fieldLabels.forEach((label, index) => {
      const x = origin[0];
      const y = height - origin[1] - (index * (bubbleSize + bubblesGap));
      
      // Draw the label
      page.drawText(label, {
        x: x - labelsGap,
        y: y,
        size: 12,
      });

      // Draw the bubble
      page.drawCircle({
        x: x,
        y: y,
        size: bubbleSize / 2,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    });
  });

  const pdfBytes = await pdfDoc.save();

  // Download the PDF
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'bubble-sheet.pdf';
  link.click();
};
