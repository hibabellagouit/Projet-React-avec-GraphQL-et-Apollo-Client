import React from 'react';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { gql } from '@apollo/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  CircularProgress, 
  Box,
  Chip
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const GET_TRANSACTIONS = gql`
  query GetTransactions($accountId: ID) {
    transactions(accountId: $accountId) {
      id
      amount
      type
      description
      createdAt
      account {
        accountNumber
      }
    }
  }
`;

const TransactionList = ({ accountId }) => {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
    variables: { accountId },
    pollInterval: 30000 // Rafraîchissement toutes les 30 secondes
  });

  const getTransactionColor = (type) => {
    switch(type) {
      case 'DEPOSIT':
        return 'success';
      case 'WITHDRAWAL':
        return 'error';
      case 'TRANSFER':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTransactionType = (type) => {
    const types = {
      'DEPOSIT': 'Dépôt',
      'WITHDRAWAL': 'Retrait',
      'TRANSFER': 'Virement'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Erreur lors du chargement des transactions: {error.message}</Typography>;
  }

  return (
    <Box mt={4}>
      <Box display="flex" alignItems="center" mb={3}>
        <AccountBalanceWalletIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
        <Typography variant="h5" component="h2">
          Historique des Transactions
        </Typography>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Compte</TableCell>
              <TableCell align="right">Montant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Aucune transaction trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    {new Date(parseInt(transaction.createdAt)).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={formatTransactionType(transaction.type)}
                      color={getTransactionColor(transaction.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{transaction.description || 'Aucune description'}</TableCell>
                  <TableCell>{transaction.account?.accountNumber || 'N/A'}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{
                      color: transaction.type === 'WITHDRAWAL' ? 'error.main' : 'success.main',
                      fontWeight: 'bold'
                    }}
                  >
                    {transaction.type === 'WITHDRAWAL' ? '-' : '+'}
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(Math.abs(transaction.amount))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionList;
