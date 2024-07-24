import React, { useState } from 'react';
import BubbleSheetForm from '../../components/BubbleSheetForm';
import GeneratedJson from '../../components/GeneratedJson';

const CustomBubbleSheet = () => {
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  return (
    <div>
      <h1>Bubble Sheet Generator</h1>
      <BubbleSheetForm onSubmit={handleFormSubmit} />
      {formData && <GeneratedJson data={formData} />}
    </div>
  );
};

export default CustomBubbleSheet;