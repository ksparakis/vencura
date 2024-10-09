async function getBalance() {
  return makeAPIRequest('GET', 'http://localhost:3050/wallet/balance')
}

async function signMessage(message: string, password: string) {
    const signResponse = await makeAPIRequest('POST', 'http://localhost:3050/wallet/sign', {},
        {message, password})
    console.log(signResponse)
    return signResponse.json()
}

async function getUser(){
  return makeAPIRequest('GET', 'http://localhost:3050/user')
}

async function sendTransaction(password: string, amount: number, to: string ){
  return makeAPIRequest('POST', 'http://localhost:3050/wallet/transaction', {}, {password, to, amount})
}

async function checkTransaction(transactionId: string){
  return makeAPIRequest('GET', `http://localhost:3050/wallet/transaction/${transactionId}` )
}



async function createUser(password: string){
  return makeAPIRequest('POST', 'http://localhost:3050/user', {},
      {password: password})
}


function getToken(){
  const token = localStorage.getItem('dynamic_authentication_token');
  if(!token){
    console.log('no token')
    return ""
  }
  return token.replace(/^"|"$/g, '');  // Removes leading and trailing quotes
}

async function getOrCreateUser(password: string = '1234567'){
  let userResponse;
    userResponse = await getUser()
  if(userResponse.status === 404){
    userResponse = await createUser(password)
  }
  console.log('userResponse', userResponse);
  const user = await userResponse.json()
  console.log('user', user);
  const balanceResponse = await getBalance()
  if(!balanceResponse)
  {
    throw new Error('No balance')
  }

  const balance = await balanceResponse.json()
    return { ...user['user'] , ...balance}
}


async function getOtherUsers(){
  const res= await makeAPIRequest('GET', 'http://localhost:3050/user/others')
  return res.json()
}



async function makeAPIRequest(method: string, url: string, headers: any| undefined = {}, body: any | undefined = undefined) {
  const token = getToken()
  headers = {
    ...headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  return await fetch(url, {
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
