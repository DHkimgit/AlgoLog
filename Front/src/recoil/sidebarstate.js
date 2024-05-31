import {atom} from 'recoil';

const sideBarStateAtom = atom({
    key: 'sidebar',
    default: true
});

export default sideBarStateAtom