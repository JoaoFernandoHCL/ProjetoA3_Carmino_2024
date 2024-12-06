import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import TextEditor from '../componentes/TextEditor';
import { main } from '../dist';

function Interpretador() {
  const [code, setCode] = useState(''); // Sempre inicializado como string
  const [output, setOutput] = useState('');

  const executarCodigo = () => {
    try {
      const resultado = main(code);
      const parsedResult = JSON.parse(resultado);
      console.log("Resultado recebido:", resultado);
  
      if (Array.isArray(parsedResult)) {
        const prints = parsedResult
          .filter((item) => item.type === "print")
          .map((item) => item.value);
  
        console.log("Valores extraídos para output:", prints);
        setOutput(prints);
      } else {
        console.error("Formato inválido:", parsedResult);
        setOutput(["Erro: Formato inválido."]);
      }
    } catch (error) {
      console.error("Erro na execução:", error);
      setOutput([`Erro: ${error.message}`]);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 3,
        maxWidth: '600px',
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: 3,
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" sx={{ textAlign: 'center' }}>
        Interpretador de Código
      </Typography>
      <TextEditor value={code} onValueChange={(newCode) => setCode(newCode)} />
      <Button
        variant="contained"
        color="primary"
        onClick={executarCodigo}
        sx={{ alignSelf: 'center', width: 'fit-content' }}
      >
        Executar Código
      </Button>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          padding: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Saída:
        </Typography>
        <Typography
          variant="body1"
          sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: '"Fira Code", monospace',
          }}
        >
        {Array.isArray(output) ? (
          output.map((line, index) => (
            <div key={index}>{line}</div> // Garante que cada linha seja renderizada
          ))
        ) : (
          <div>Erro: Saída inválida.</div>
        )}
        </Typography>
      </Box>
    </Box>
  );
}

export default Interpretador;
