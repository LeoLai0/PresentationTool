import Prism from 'prismjs';
import React, { useEffect, useRef } from 'react';

import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';

// Function which sets the syntax highlighting when outputting code to the slide.
const CodeSyntax = ({ code, language }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, language]);

  return (
    <pre style={{ margin: 0, height: '100%' }}>
      <code ref={codeRef} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
}

export default CodeSyntax;
