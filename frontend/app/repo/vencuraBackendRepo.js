import {rsaEncrypt} from '@/app/repo/crypto';

async function getBalance() {
    const balanceResponse = await makeAPIRequest('GET', `/wallet/balance`);
    if (!balanceResponse) {
        throw new Error('No balance');
    }

    return balanceResponse.json();
}

async function signMessage(message, password) {
    const signResponse = await makeAPIRequest(
        'POST',
        `/wallet/sign`,
        {},
        { message, password }
    );
    return signResponse.json();
}

async function verifyUser(password) {
    return makeAPIRequest('POST', `/user/verify`, {}, {password});
}

async function getEncryptionKey() {
    const response = await makeAPIRequest('GET', `/user/key`);
    return await response.json();
}

async function changeNetwork(network) {
    return makeAPIRequest('PUT', `/user/network`, {}, {network});
}

async function sendTransaction(password, amount, to) {
   const transactionRes = await makeAPIRequest('POST', `/wallet/transaction`,
       {}, { password, to, amount });
   const tx = await transactionRes.json();
   return tx.transactionId;
}

async function checkTransaction(transactionId) {
    const response = await makeAPIRequest('GET', `/wallet/transaction/${transactionId}`);
    const body = await response.json()
    return body;
}

async function createUser(password) {
    return makeAPIRequest('POST', `/user`, {}, { password });
}

function getToken() {
    const token = localStorage.getItem('dynamic_authentication_token');
    if (!token) {
        console.log('no token');
        return "";
    }
    return token.replace(/^"|"$/g, ''); // Removes leading and trailing quotes
}

async function getOrCreateUser(password) {
    let userResponse;
    let encryptionKey;
    let errorOccured = false;
    try{
       const getEncryptionRes = await getEncryptionKey();
         encryptionKey = getEncryptionRes.publicKey;
    } catch (error) {
        console.log(error)
        errorOccured = true;
        throw new Error('Encryption Error');
    }

    const encryptedPassword = await rsaEncrypt(password, encryptionKey);
    console.log(encryptedPassword)
    try{
        userResponse = await verifyUser(encryptedPassword);
    } catch (error) {
        console.log(error)
        errorOccured = true;
    }

    if(userResponse.status === 401) {
        throw new Error('Wrong Password');
    }
    if (userResponse.status >= 400 || errorOccured) {
        userResponse = await createUser(encryptedPassword);
    }
    const user = await userResponse.json();
    const balance = await getBalance();
    console.log(user)
    return { ...user['user'], ...balance, encryptedPassword };
}

async function getOtherUsers() {
    const res = await makeAPIRequest('GET', `/user/others`);
    return res.json();
}


async function makeAPIRequest(method, url, headers= {}, body = undefined) {
  const token = getToken()
  headers = {
    ...headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if(!API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined, please define it in your .env file');
    }

    return await fetch(`${API_BASE_URL}${url}`, {
    method: method,
    headers: headers,
    body: JSON.stringify(body)
  });
}

export {
    verifyUser,
    createUser,
    getBalance,
    getOrCreateUser,
    getOtherUsers,
    signMessage,
    sendTransaction,
    checkTransaction,
    changeNetwork,
    getEncryptionKey
}
