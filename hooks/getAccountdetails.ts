declare global {
  interface Window {
    ethereum?: any;
  }
}

const GetAccountDetails = () => {
  if (typeof window.ethereum !== 'undefined') {
    return window.ethereum.selectedAddress || '';
  }
  return '';
};

export default GetAccountDetails; 