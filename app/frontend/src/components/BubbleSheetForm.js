import React, { useState } from 'react';

const BubbleSheetForm = ({ onSubmit }) => {
  const [pageDimensions, setPageDimensions] = useState([900, 1220]);
  const [bubbleDimensions, setBubbleDimensions] = useState([25, 25]);
  const [blocks, setBlocks] = useState([{ id: 1, fieldType: 'QTYPE_MCQ5', origin: [80, 258], fieldLabels: Array.from({ length: 25 }, (_, i) => `q${i + 1}`), bubblesGap: 23, labelsGap: 28 }]);

  const handleAddBlock = () => {
    setBlocks([...blocks, { id: blocks.length + 1, fieldType: 'QTYPE_MCQ5', origin: [80, 258], fieldLabels: Array.from({ length: 25 }, (_, i) => `q${i + 1}`), bubblesGap: 23, labelsGap: 28 }]);
  };

  const handleBlockChange = (index, key, value) => {
    const newBlocks = [...blocks];
    newBlocks[index][key] = value;
    setBlocks(newBlocks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      pageDimensions,
      bubbleDimensions,
      customLabels: {},
      fieldBlocks: blocks.reduce((acc, block) => {
        acc[`MCQBlock${block.id}`] = {
          fieldType: block.fieldType,
          origin: block.origin,
          fieldLabels: block.fieldLabels,
          bubblesGap: block.bubblesGap,
          labelsGap: block.labelsGap
        };
        return acc;
      }, {}),
      preProcessors: [
        {
          "name": "BorderPreprocessor",
          "options": {
            "border_size": 10,
            "border_color": [255, 255, 255]
          }
        }
      ]
    });
  };

  const showTable = (block) => {
    const fieldLabels = block.fieldLabels;
    const rows = 5;
    const cols = Math.ceil(fieldLabels.length / rows);

    return (
      <table>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => {
                const labelIndex = rowIndex + colIndex * rows;
                return (
                  <td key={colIndex}>{fieldLabels[labelIndex] || ''}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Page and Bubble Dimensions</h2>
      <label>
        Page Width:
        <input
          type="number"
          value={pageDimensions[0]}
          onChange={(e) => setPageDimensions([Number(e.target.value), pageDimensions[1]])}
        />
      </label>
      <label>
        Page Height:
        <input
          type="number"
          value={pageDimensions[1]}
          onChange={(e) => setPageDimensions([pageDimensions[0], Number(e.target.value)])}
        />
      </label>
      <label>
        Bubble Width:
        <input
          type="number"
          value={bubbleDimensions[0]}
          onChange={(e) => setBubbleDimensions([Number(e.target.value), bubbleDimensions[1]])}
        />
      </label>
      <label>
        Bubble Height:
        <input
          type="number"
          value={bubbleDimensions[1]}
          onChange={(e) => setBubbleDimensions([bubbleDimensions[0], Number(e.target.value)])}
        />
      </label>
      <h2>Blocks</h2>
      {blocks.map((block, index) => (
        <div key={block.id}>
          <h3>Block {block.id}</h3>
          <label>
            Field Type:
            <input
              type="text"
              value={block.fieldType}
              onChange={(e) => handleBlockChange(index, 'fieldType', e.target.value)}
            />
          </label>
          <label>
            Origin:
            <input
              type="text"
              value={block.origin.join(',')}
              onChange={(e) => handleBlockChange(index, 'origin', e.target.value.split(',').map(Number))}
            />
          </label>
          <label>
            Field Labels:
            <input
              type="text"
              value={block.fieldLabels.join(',')}
              onChange={(e) => handleBlockChange(index, 'fieldLabels', e.target.value.split(','))}
            />
          </label>
          <label>
            Bubbles Gap:
            <input
              type="number"
              value={block.bubblesGap}
              onChange={(e) => handleBlockChange(index, 'bubblesGap', Number(e.target.value))}
            />
          </label>
          <label>
            Labels Gap:
            <input
              type="number"
              value={block.labelsGap}
              onChange={(e) => handleBlockChange(index, 'labelsGap', Number(e.target.value))}
            />
          </label>
          <button type="button" onClick={() => handleBlockChange(index, 'showTable', !block.showTable)}>
            {block.showTable ? 'Hide Table' : 'Show Table'}
          </button>
          {block.showTable && showTable(block)}
        </div>
      ))}
      <button type="button" onClick={handleAddBlock}>Add Block</button>
      <button type="submit">Generate JSON</button>
    </form>
  );
};

export default BubbleSheetForm;
