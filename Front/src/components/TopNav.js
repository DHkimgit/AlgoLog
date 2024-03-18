import React from 'react'
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import sideBarStateAtom from '../recoil/sidebarstate';

const TopBox = styled.div`
    background-color: #1E293B;
    display: flex;
    justify-content: flex-start;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2);
    height: 72px;
    `
const ImageBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 0.5rem;
    margin-right: 6.97px;
`
const TextBox = styled.div`
    line-height: 72px;
    display: flex;
    margin-left: 10px;
    `
const LogoBox = styled.button`
    padding-right: 7px;
`
const MainText = styled.div`
    font-size: 30px; /* 30px */
    color: rgb(241 245 249);
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 700;
    justify-content: center;
    align-items: center;
    display:inline-block;
    letter-spacing: 2px;
`
const SubText = styled.div`
    font-size: 12px; /* 14px */
    line-height: 1.25rem; /* 20px */
    color: rgb(248 250 252);
    font-weight: 600;
`

const GridBox = styled.div`
    display: flex;
    align-items:center;
    margin-left: auto;
    padding-right: 50px;
    width: 262px;
`
const SearchBar = styled.input`
    height: 35px;
    width: 228px;
    background-color: #50627F;
    border-radius: 3px 0px 0px 3px;
    justify-content: center;
    align-items: center;
    display:inline-block;
    border: none;
    
`
const SearchBarButton = styled.button`
    height: 35px;
    width: 35px;
    background-color: #50627F;
    border-left: 1px solid #1E293B;
    border-radius: 0px 3px 3px 0px;
`
function TopNav(){
    const [sidebar, setSideBar] = useRecoilState(sideBarStateAtom);
    const setSidebar = () => {
        if (sidebar==true) {
            setSideBar(false);
            console.log(sidebar);
        }
        else {
            setSideBar(true)
            console.log(sidebar);
        }
    }
    return(
        <TopBox>
            <TextBox>
                <MainText>AlgoLog</MainText>
            </TextBox>
            <GridBox>
            </GridBox>
            
        </TopBox>
    )
}

export default TopNav;