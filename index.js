
const NodeCache = require('node-cache');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// BSCSCAN API Key (ENV)
const apiKey = process.env.BSCSCAN_API_KEY;

// Contract address of KIMA token (ENV)
const cgptContractAddress = process.env.CGPT_CONTRACT_ADDRESS;

// Maximum Supply of KIMA token (ENV)
const MaxSupply = process.env.CGPT_MAX_SUPPLY;

const cache = new NodeCache({ stdTTL: 600 }); // Set the cache expiration time to 600 seconds (10 minutes)

// List of contract addresses with additional information
const contractAddresses = [
  {
    address: '0x170435cBD12058Fd99fE4FB88e69a6593b5f9586',
    chain: 'Arbitrum',
    type: 'ChainGPT Pad (IDO)',
    wallet: 'Public Round (ref: tokenomics)', 
  },
  {
    address: '0xD874F18C5683dEE27544875D43f6Adf628b0Ca5f',
    chain: 'Arbitrum',
    type: 'DEXTPad (IDO)',
    wallet: 'Public Round (ref: tokenomics)', 
  },
  {
    address: '0x686392fFd55F6563AA96Ff158a0e320d03c67e2e',
    chain: 'Arbitrum',
    type: 'PolkaStarter (IDO)',
    wallet: 'Public Round (ref: tokenomics)', 
  },
  {
    address: '0xf77d701d4EB2819e2047426C2E8b3E56b7cfDA63',
    chain: 'Arbitrum',
    type: 'ChainGPT Pad (Private & KOLs Sale)',
    wallet: 'Private/KOLs Rounds (ref: tokenomics)', 
  },
  {
    address: '0xFfA133D501A8fc871edcC952b2e1E5d1Dc5b6905',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Early-Backers Round (ref: tokenomics)', 
  },
  {
    address: '0xAa48C7cBb50Aa9005d4284779f917e56ae7C2b0D',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Pre-Seed Round (ref: tokenomics)', 
  },
  {
    address: '0xB8AB681556eF6d70653f8720A83ba61222E44823',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Seed Round (ref: tokenomics)', 
  },
  {
    address: '0x510B7b7Df04164365c40F81E45c42a4a56F6c4FA',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Pre-Sale Round (ref: tokenomics)', 
  },
  {
    address: '0x4451E20834614c8bA30dA11A4d00dA7F557B4108',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'KOLs Round (ref: tokenomics)', 
  },
  {
    address: '0x0EBe72Fcf570095C9e0e6A4b0aF78608Bf3FD918',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Strategic-1 Round (ref: tokenomics)', 
  },
  {
    address: '0x7Bcb0B84f35BA7BA09bF9A0717Ad4E9B9556e6A9',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Strategic-2 Round (ref: tokenomics)', 
  },
  {
    address: '0xCeD84552224109be6b93b332c9E7c5663A31BFf2',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Private-1 Round (ref: tokenomics)', 
  },
  {
    address: '0x8F2a87aC43d136371D8c0Fd4581f3c1f3F490617',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Private-2 Round (ref: tokenomics)', 
  },
  {
    address: '0xD3FfB66B40A4ee308e18337530Dd8c8D0DA6390C',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Team Round (ref: tokenomics)', 
  },
  {
    address: '0xf9886ce6Fa93943AeE6f7662c70eba753180dd53',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Advisors Round (ref: tokenomics)', 
  },
  {
    address: '0x85C23fea1918989dE98a176c198e8D571223a198',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Development Fund Round (ref: tokenomics)', 
  },
  {
    address: '0x63a012D60612B97ADA9156B2900f44EBD31b26Aa',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Marketing Round (ref: tokenomics)', 
  },
  {
    address: '0x280A41c9Fe933BaF84D95f8D1d7Bd022ae8B82d9',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Foundation Round (ref: tokenomics)', 
  },
  {
    address: '0xD1a724B9BD7F4C89549025df3e6652535824a834',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Liquidity Pool Round (ref: tokenomics)', 
  },
  {
    address: '0x5C9612173D2c789EfF7BB0426f153Ce18eF48643',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting',
    wallet: 'Community + LIP Round (ref: tokenomics)', 
  },
  {
    address: '0x27c7085578c09f9CD4eCc051DB40071B88C0bD4D',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting [Incubation Fee]',
    wallet: 'Team Round (ref: tokenomics)', 
  },
  {
    address: '0x9b359EdEFF357FbE23446C0cB537120c572e38a4',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting [Incubation Fee]',
    wallet: 'Team Round (ref: tokenomics)', 
  },
  {
    address: '0x1dB6227c797cC5DB1EaCE59fFeC843C654B9Bed5',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting [Incubation Fee]',
    wallet: 'Advisory Round (ref: tokenomics)', 
  },
  {
    address: '0xAbb4864d14f8E5C96f73ced9Cdcccc841DE56f6d',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting [Incubation Fee]',
    wallet: 'Advisory Round (ref: tokenomics)', 
  },
  {
    address: '0x6858B586AC59Af48112C927F3b70A3cCcbCf4788',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting [Incubation Fee]',
    wallet: 'Marketing Round (ref: tokenomics)', 
  },
  {
    address: '0x0CF35e00a32190bef54791D9790A15ec9f0d608F',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting [Incubation Fee]',
    wallet: 'Marketing Round (ref: tokenomics)', 
  },
  {
    address: '0x3D52D028526BCAd1f8967e0b522AfE1eC2CC8202',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting [Incubation Fee]',
    wallet: 'Foundation Round (ref: tokenomics)', 
  },
  {
    address: '0x6f449832B95DF11c80Cd69dD2aB0664217f173B2',
    chain: 'Arbitrum',
    type: 'TeamFinance Vesting [Incubation Fee]',
    wallet: 'Foundation Round (ref: tokenomics)', 
  },
  {
    address: '0xbA80Cb24185EF36deb1607Ab4CA17aC1389a6957',
    chain: 'Arbitrum',
    type: 'ChainGPT Pad Giveaway [Incubation Fee]',
    wallet: 'Foundation Round (ref: tokenomics)', 
  },
];


async function getTotalSupply() {
  const cachedTotalSupply = cache.get('totalSupply');
  if (cachedTotalSupply !== undefined) {
    return cachedTotalSupply;
  }

  try {
    const url = `https://api.arbiscan.io/api?module=stats&action=tokensupply&contractaddress=${cgptContractAddress}&apikey=${apiKey}`;
    const response = await axios.get(url);
    const result = response.data.result;

    cache.set('totalSupply', result); // Cache the total supply

    return result;
  } catch (error) {
    console.error('Error fetching total supply:', error);
    throw error;
  }
}

// This is the home-page URL that will show a detailed list of the excluded addresses from the supply and all the data such as total supply, burnt supply, circulating supply, etc.
app.get('/', async (req, res) => {
  const cachedBalances = cache.get('balances');
  if (cachedBalances !== undefined) {
    res.send(cachedBalances);
    return;
  }

  try {
    const balances = [];
    const batchSize = 3; // Number of requests per second
    let batch = [];
    
    // Helper function to fetch balance for a given address
    const fetchBalance = async ({ address, chain, type, wallet }) => {
      const url = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet });
    };

    for (const addressData of contractAddresses) {
      batch.push(fetchBalance(addressData));

      if (batch.length === batchSize) {
        await Promise.all(batch); // Process the current batch
        batch = []; // Clear the batch
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      }
    }

    // Process any remaining addresses
    if (batch.length > 0) {
      await Promise.all(batch);
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      const bscScanLink = `https://arbiscan.io/token/${cgptContractAddress}?a=${address}`;

      tableRows += `<tr>
      <td><a href="${bscScanLink}" target="_blank">${address}</a></td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = MaxSupply - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = MaxSupply - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = ` <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
  
    h1 {
      color: #333;
      font-size: 32px;
      margin-bottom: 20px;
      text-align: center;
    }
  
    p {
      color: #666;
      font-size: 16px;
      margin-bottom: 10px;
    }
  
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      background-color: #fff;
    }
  
    th,
    td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
  
    th {
      background-color: #f9f9f9;
      font-weight: bold;
      font-size: 16px;
    }
  
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
  
    a {
      color: #337ab7;
      text-decoration: underline;
    }
  
    a:hover {
      color: #23527c;
    }
  
    .title-row {
      background-color: #333;
      color: black;
      font-weight: bold;
      font-size: 18px;
    }
  
    .total-supply-row {
      background-color: #f9f9f9;
    }
  
    .empty-row {
      background-color: transparent;
    }
  
    /* Responsive Styles */
    @media screen and (max-width: 600px) {
      h1 {
        font-size: 24px;
      }
  
      p {
        font-size: 14px;
      }
  
      th,
      td {
        padding: 8px;
      }
    }
  </style>
  
  <h1>$CGPT Circulating Supply Tracker</h1>
  <p>Total Supply: 210,000,000</p>
  <p>Burnt $CGPT: ${burntTokens.toLocaleString()}</p>
  <p>Live Circulating Supply of $CGPT: ${totalSupply.toLocaleString()} </p>
  <br><br>
  <table>
    <tr class="title-row">
      <th>Contract Address</th>
      <th>Balance (KIMA)</th>
      <th>Chain</th>
      <th>Type</th>
      <th>Name</th>
    </tr>
    ${tableRows}
    <tr class="empty-row">
      <td colspan="5"></td>
    </tr>
    <tr class="total-supply-row">
      <td>$CGPT Circulating Supply</td>
      <td>${totalSupply.toLocaleString()}</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table>

    `;

    cache.set('balances', htmlResponse); // Cache the response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});



// This is an API endpoint that will show only the number of the circulating supply (normally used for CMC supply tracking)
app.get('/supply', async (req, res) => {
  const cachedSupply = cache.get('supply');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
      // Introduce a delay of 250ms (1 second / 4) between each API call
      await new Promise(resolve => setTimeout(resolve, 250));

      const url = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18)}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = MaxSupply - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = MaxSupply - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${totalSupply}`;

    cache.set('supply', htmlResponse); // Cache the supply response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});


// This API endpoint will show the total supply
app.get('/totalsupply', async (req, res) => {
  const cachedSupply = cache.get('newtotal');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
        await new Promise(resolve => setTimeout(resolve, 250));

      const url = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18)}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = MaxSupply - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = MaxSupply - Math.floor(totalBalance / 10 ** 18) - burntTokens;
    const newTotalS = MaxSupply - burntTokens; 
    const htmlResponse = `${newTotalS}`;

    cache.set('newtotal', htmlResponse); // Cache the newtotal response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});



// This API endpoint will show the total tokens burnt
app.get('/burn', async (req, res) => {
  const cachedSupply = cache.get('burn');
  if (cachedSupply !== undefined) {
    res.send(cachedSupply);
    return;
  }

  try {
    const balances = [];

    for (const { address, chain, type, wallet, name } of contractAddresses) {
        await new Promise(resolve => setTimeout(resolve, 250));

      const url = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${cgptContractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
      const response = await axios.get(url);
      const balance = parseInt(response.data.result);

      balances.push({ address, balance, chain, type, wallet, name });
    }

    balances.sort((a, b) => b.balance - a.balance); // Sort balances in descending order

    let totalBalance = 0;
    let tableRows = '';

    for (const { address, balance, chain, type, wallet } of balances) {
      totalBalance += balance;
      tableRows += `<tr>
        <td>${address}</td>
        <td>${Math.floor(balance / 10 ** 18).toLocaleString()}</td>
        <td>${chain}</td>
        <td>${type}</td>
        <td>${wallet}</td>
      </tr>`;
    }

    const totalSupplyEndpointResult = await getTotalSupply();
    const burntTokens = MaxSupply - Math.floor(totalSupplyEndpointResult / 10 ** 18);
    const totalSupply = MaxSupply - Math.floor(totalBalance / 10 ** 18) - burntTokens;

    const htmlResponse = `${burntTokens.toLocaleString()}`;

    cache.set('burn', htmlResponse); // Cache the burn response

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
