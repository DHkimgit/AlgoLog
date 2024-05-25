// store.js
import {create} from 'zustand';

export const useTokenStore = create((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token })
}));

export const useLoginStateStore = create((set) => ({
    loginState: false,
    setLoginState: (state) => set({ loginState: state })
}))