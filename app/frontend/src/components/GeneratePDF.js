import { PDFDocument, rgb } from 'pdf-lib';

export const generatePDF = async (data) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([data.pageDimensions[0], data.pageDimensions[1]]);
  const { width, height } = page.getSize();

  // Draw a border if specified
  const borderOptions = data.preProcessors.find(proc => proc.name === 'CropPage')?.options;
  if (borderOptions) {
    page.drawRectangle({
      x: borderOptions.morphKernel[0] / 2,
      y: borderOptions.morphKernel[1] / 2,
      width: width - borderOptions.morphKernel[0],
      height: height - borderOptions.morphKernel[1],
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  }

  // Function to draw a bubble
  const drawBubble = (page, x, y, size) => {
    page.drawCircle({
      x: x,
      y: y,
      size: size / 2,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  };

  // Function to draw a label
  const drawLabel = (page, x, y, label, size) => {
    page.drawText(label, {
      x: x,
      y: y,
      size: size,
    });
  };

  // Draw the student ID block
  const studentIDBlock = data.fieldBlocks['StudentID'];
  const studentIDBubbleSize = data.bubbleDimensions[0];

  studentIDBlock.fieldLabels.forEach((label, index) => {
    const x = studentIDBlock.origin[0];
    const y = height - studentIDBlock.origin[1] - (index * (studentIDBubbleSize + studentIDBlock.bubblesGap));
    
    // Draw the label
    drawLabel(page, x - studentIDBlock.labelsGap, y, label, 12);

    // Draw the bubble
    drawBubble(page, x, y, studentIDBubbleSize);
  });

  // Draw the bubble blocks
  Object.keys(data.fieldBlocks).forEach(blockName => {
    if (blockName === 'StudentID') return; // Skip the StudentID block

    const block = data.fieldBlocks[blockName];
    const bubbleSize = data.bubbleDimensions[0];

    block.fieldLabels.forEach((label, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      const x = block.origin[0] + (col * (bubbleSize + block.bubblesGap));
      const y = height - block.origin[1] - (row * (bubbleSize + block.bubblesGap));
      
      // Draw the label
      drawLabel(page, x - block.labelsGap, y, label, 12);

      // Draw the bubble
      drawBubble(page, x, y, bubbleSize);
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
