import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react/hooks/useMutation';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { gql } from '@apollo/client';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Divider,
  Grid,
  InputAdornment
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      accountNumber
      balance
      currency
    }
  }
`;

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      amount
      type
      description
    }
  }
`;

const TRANSFER_FUNDS = gql`
  mutation TransferFunds($input: TransferInput!) {
    transferFunds(input: $input) {
      id
      amount
      type
      description
    }
  }
`;

const TransactionForm = ({ refetchAccounts, refetchTransactions }) => {
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('DEPOSIT');
  const [formData, setFormData] = useState({
    accountId: '',
    toAccountId: '',
    amount: '',
    description: ''
  });

  const { data: accountsData } = useQuery(GET_ACCOUNTS);
  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION);
  const [transferFunds, { loading: transferring }] = useMutation(TRANSFER_FUNDS);

  useEffect(() => {
    if (accountsData?.accounts?.length > 0 && !formData.accountId) {
      setFormData(prev => ({
        ...prev,
        accountId: accountsData.accounts[0].id
      }));
    }
  }, [accountsData, formData.accountId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTransactionType('DEPOSIT');
    setFormData({
      accountId: accountsData?.accounts[0]?.id || '',
      toAccountId: '',
      amount: '',
      description: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
    setFormData(prev => ({
      ...prev,
      toAccountId: '',
      description: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (transactionType === 'TRANSFER') {
        await transferFunds({
          variables: {
            input: {
              fromAccountId: formData.accountId,
              toAccountId: formData.toAccountId,
              amount: parseFloat(formData.amount) || 0,
              description: formData.description
            }
          }
        });
      } else {
        await createTransaction({
          variables: {
            input: {
              accountId: formData.accountId,
              type: transactionType,
              amount: parseFloat(formData.amount) || 0,
              description: formData.description
            }
          }
        });
      }
      
      // Rafraîchir les données
      refetchAccounts();
      refetchTransactions();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de l\'opération:', error);
    }
  };

  const getSelectedAccountCurrency = () => {
    if (!formData.accountId || !accountsData?.accounts) return 'EUR';
    const account = accountsData.accounts.find(acc => acc.id === formData.accountId);
    return account?.currency || 'EUR';
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AccountBalanceWalletIcon />}
        onClick={handleClickOpen}
      >
        Nouvelle Opération
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <AccountBalanceWalletIcon sx={{ mr: 1 }} />
              <span>Nouvelle Opération</span>
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Type d'opération
              </Typography>
              <Box display="flex" gap={2} mb={3}>
                <Button
                  variant={transactionType === 'DEPOSIT' ? 'contained' : 'outlined'}
                  onClick={() => handleTransactionTypeChange('DEPOSIT')}
                  fullWidth
                >
                  Dépôt
                </Button>
                <Button
                  variant={transactionType === 'WITHDRAWAL' ? 'contained' : 'outlined'}
                  onClick={() => handleTransactionTypeChange('WITHDRAWAL')}
                  fullWidth
                >
                  Retrait
                </Button>
                <Button
                  variant={transactionType === 'TRANSFER' ? 'contained' : 'outlined'}
                  onClick={() => handleTransactionTypeChange('TRANSFER')}
                  fullWidth
                >
                  Virement
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="account-label">Compte {transactionType === 'TRANSFER' ? 'source' : ''}</InputLabel>
                  <Select
                    labelId="account-label"
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    label={`Compte ${transactionType === 'TRANSFER' ? 'source' : ''}`}
                    required
                  >
                    {accountsData?.accounts?.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.accountNumber} - {account.balance.toFixed(2)} {account.currency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {transactionType === 'TRANSFER' && (
                <>
                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <SwapHorizIcon color="action" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="to-account-label">Compte destinataire</InputLabel>
                      <Select
                        labelId="to-account-label"
                        name="toAccountId"
                        value={formData.toAccountId}
                        onChange={handleChange}
                        label="Compte destinataire"
                        required
                      >
                        {accountsData?.accounts
                          ?.filter(account => account.id !== formData.accountId)
                          .map((account) => (
                            <MenuItem key={account.id} value={account.id}>
                              {account.accountNumber} - {account.balance.toFixed(2)} {account.currency}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="amount"
                  label="Montant"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{getSelectedAccountCurrency()}</InputAdornment>,
                    inputProps: { 
                      step: "0.01",
                      min: "0.01"
                    }
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <Divider />
          
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} color="inherit">
              Annuler
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              variant="contained"
              disabled={creating || transferring}
            >
              {(creating || transferring) ? 'Traitement...' : 'Valider'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default TransactionForm;
