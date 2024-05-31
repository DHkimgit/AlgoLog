import { atom } from "recoil";

const loginStateAtom = atom({
    key: 'loginstate',
    default: false
});

export default loginStateAtom