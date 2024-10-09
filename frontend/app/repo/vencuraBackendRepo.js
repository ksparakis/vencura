
async function getBalance() {
    return makeAPIRequest('GET', `/wallet/balance`);
}

async function signMessage(message, password) {
    const signResponse = await makeAPIRequest(
        'POST',
        `/wallet/sign`,
        {},
        { message, password }
    );
    console.log(signResponse);
    return signResponse.json();
}

async function getUser() {
    return makeAPIRequest('GET', `/user`);
}

async function sendTransaction(password, amount, to) {
    return makeAPIRequest('POST', `/wallet/transaction`, {}, { password, to, amount });
}

async function checkTransaction(transactionId) {
    return makeAPIRequest('GET', `/wallet/transaction/${transactionId}`);
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

async function getOrCreateUser(password = '1234567') {
    let userResponse;
    userResponse = await getUser();
    if (userResponse.status === 404) {
        userResponse = await createUser(password);
    }
    console.log('userResponse', userResponse);
    const user = await userResponse.json();
    console.log('user', user);
    const balanceResponse = await getBalance();
    if (!balanceResponse) {
        throw new Error('No balance');
    }

    const balance = await balanceResponse.json();
    return { ...user['user'], ...balance };
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
    getUser,
    createUser,
    getOrCreateUser,
    getOtherUsers,
    signMessage,
    sendTransaction,
    checkTransaction
}
