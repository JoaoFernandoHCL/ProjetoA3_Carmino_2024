import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import TextEditor from '../componentes/TextEditor';

function Interpretador() {
  const [code, setCode] = useState(''); // Sempre inicializado como string
  const [output, setOutput] = useState('');

  const executarCodigo = () => {
    try {
      // usar o interpretador para executar o código e gerar a lista de objetos
      const resultado = code;

      // Valida se o resultado é um array de objetos com o formato esperado
      if (Array.isArray(resultado)) {
        const prints = resultado
          .filter((item) => item.type === 'print') // Filtra apenas os objetos do tipo "print"
          .map((item) => item.value); // Extrai os valores

        setOutput(prints); // Atualiza o estado com os valores
      } else {
        setOutput(['Erro: O código não retornou um array de objetos válidos.']);
      }
    } catch (error) {
      setOutput([`Erro: ${error.message}`]); // Mostra o erro como uma linha no output
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
            whiteSpace: 'pre-wrap', // Exibe cada valor em uma nova linha
            fontFamily: '"Fira Code", monospace',
          }}
        >
          {output.join('\n')} {/* Junta os valores com quebra de linha */}
        </Typography>
      </Box>
    </Box>
  );
}

export default Interpretador;
