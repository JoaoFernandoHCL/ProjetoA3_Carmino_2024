import React from 'react';
import Editor from 'react-simple-code-editor';
import { Box } from '@mui/material';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

function TextEditor({ value = '', onValueChange }) {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Editor
        value={value}
        onValueChange={onValueChange}
        highlight={(code) => highlight(code || '', languages.js)} // Previne o erro
        padding={10}
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 14,
          minHeight: '200px',
          outline: 'none',
        }}
      />
    </Box>
  );
}

export default TextEditor;
