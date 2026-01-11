import React from 'react';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import gql from 'graphql-tag';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      accountNumber
      accountType
      balance
      currency
      createdAt
    }
  }
`;

const AccountList = () => {
  const { loading, error, data } = useQuery(GET_ACCOUNTS);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Erreur lors du chargement des comptes: {error.message}</Typography>;
  }

  return (
    <div>
      <Box display="flex" alignItems="center" mb={3}>
        <AccountBalanceIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
        <Typography variant="h5" component="h2">Liste des Comptes</Typography>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro de compte</TableCell>
              <TableCell>Type de compte</TableCell>
              <TableCell align="right">Solde</TableCell>
              <TableCell>Devise</TableCell>
              <TableCell>Date de création</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.accounts.map((account) => (
              <TableRow key={account.id} hover>
                <TableCell>{account.accountNumber}</TableCell>
                <TableCell>{account.accountType}</TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: account.currency || 'EUR',
                  }).format(account.balance || 0)}
                </TableCell>
                <TableCell>{account.currency || 'EUR'}</TableCell>
                <TableCell>
                  {new Date(parseInt(account.createdAt)).toLocaleDateString('fr-FR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AccountList;
