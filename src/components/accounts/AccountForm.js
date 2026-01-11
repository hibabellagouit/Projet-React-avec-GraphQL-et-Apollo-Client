import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react/hooks/useMutation';
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
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      accountNumber
      accountType
      balance
      currency
    }
  }
`;

const AccountForm = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountType: 'CHECKING',
    initialBalance: '',
    currency: 'EUR'
  });

  const [createAccount, { loading, error }] = useMutation(CREATE_ACCOUNT, {
    onCompleted: () => {
      setOpen(false);
      refetch();
    }
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAccount({
      variables: {
        input: {
          accountType: formData.accountType,
          balance: parseFloat(formData.initialBalance) || 0,
          currency: formData.currency
        }
      }
    });
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleClickOpen}
      >
        Nouveau Compte
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Créer un nouveau compte</DialogTitle>
          <DialogContent>
            {error && (
              <Typography color="error" gutterBottom>
                Erreur: {error.message}
              </Typography>
            )}
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="account-type-label">Type de compte</InputLabel>
              <Select
                labelId="account-type-label"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                label="Type de compte"
                required
              >
                <MenuItem value="CHECKING">Compte courant</MenuItem>
                <MenuItem value="SAVINGS">Compte épargne</MenuItem>
                <MenuItem value="BUSINESS">Compte professionnel</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              name="initialBalance"
              label="Solde initial"
              type="number"
              value={formData.initialBalance}
              onChange={handleChange}
              inputProps={{
                step: "0.01",
                min: "0"
              }}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="currency-label">Devise</InputLabel>
              <Select
                labelId="currency-label"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                label="Devise"
                required
              >
                <MenuItem value="EUR">EUR (€)</MenuItem>
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="GBP">GBP (£)</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Annuler
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer le compte'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AccountForm;
