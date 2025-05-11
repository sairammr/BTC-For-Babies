import { getLocalStorage, request } from '@stacks/connect';

export default function GetAccountDetails() {        
        const userData = getLocalStorage();
        return userData?.addresses.stx[0].address;   
}
