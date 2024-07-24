import React from 'react';

const GeneratedJson = ({ data }) => {
  return (
    <div>
      <h2>Generated JSON</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default GeneratedJson;
