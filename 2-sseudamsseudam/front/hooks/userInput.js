import React, { useState, useCallback } from 'react';

const userInput = (initialValue = null) => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e) => { setValue(e.target.value); }, []);
  return [value, handler, setValue];
};


export default userInput;

