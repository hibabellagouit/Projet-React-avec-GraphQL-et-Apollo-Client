import React, { useState, useRef } from 'react';
import { ApolloProvider } from '@apollo/client/react/context/ApolloProvider';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountList from './components/accounts/AccountList';
import AccountForm from './components/accounts/AccountForm';
import TransactionList from './components/transactions/TransactionList';
import TransactionForm from './components/transactions/TransactionForm';
import client from './context/ApolloContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const accountsRef = useRef(null);
  const transactionsRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setTabValue(1); // Switch to transactions tab
  };

  const refreshAccounts = () => {
    if (accountsRef.current) {
      accountsRef.current.refetch();
    }
  };

  const refreshTransactions = () => {
    if (transactionsRef.current) {
      transactionsRef.current.refetch();
    }
  };

  return (
    <ApolloProvider client={client}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <AccountBalanceIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Gestion Bancaire
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="navigation tabs"
                variant="fullWidth"
              >
                <Tab label="Comptes" {...a11yProps(0)} />
                <Tab label="Transactions" {...a11yProps(1)} disabled={!selectedAccount} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <AccountForm refetch={refreshAccounts} />
              </Box>
              <AccountList 
                ref={accountsRef} 
                onAccountSelect={handleAccountSelect} 
                selectedAccountId={selectedAccount?.id}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {selectedAccount && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                      Compte: {selectedAccount.accountNumber} - Solde: {selectedAccount.balance.toFixed(2)} {selectedAccount.currency}
                    </Typography>
                    <TransactionForm 
                      accountId={selectedAccount.id}
                      refetchAccounts={refreshAccounts}
                      refetchTransactions={refreshTransactions}
                    />
                  </Box>
                  <TransactionList 
                    ref={transactionsRef}
                    accountId={selectedAccount.id}
                  />
                </>
              )}
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </ApolloProvider>
  );
}

export default App;
