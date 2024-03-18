import { atom } from 'recoil';

export const accessTokenAtom = atom({
  key: 'accessToken', 
  default: '', 
});

export default accessTokenAtom