import React from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import userNameAtom from '../recoil/username';
import userEmailAtom from '../recoil/email';
import bojIdAtom from '../recoil/bojid';
import { useRecoilState, useRecoilValue } from 'recoil';

const Sidebarbox = styled.div`
    background-color: #50627F;
    width: 221px;
    height: 700px;
    box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 1px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14);
`
const User = styled.div`
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 29px;
    color: #F1F5F9;
    padding-top: 19px;
    padding-left: 18px;
`

const UserDataBox = styled.div`
    padding-top: 9px;
`

const UserID = styled.div`
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    padding-top: 9px;
    padding-left: 18px;
    color: #FFFFFF;
`

const UserNames = styled.div`
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 26px;
    line-height: 32px;
    color: #FFFFFF;
    padding-left: 16px;
    
`

const UserAffiliatedUnit = styled.div`
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 22px;
    color: #FFFFFF;
    padding-left: 18px;
`

const Line = styled.div`
    background: #D9D9D9;
    border: 1px solid #F1F5F9;
    margin-left: 18px;
    margin-right: 14px;
    margin-top: 5px;
`

const NavBox = styled.div`
    background-color: #50627F;
`

const NavInfo = styled.div`
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 29px;
    color: #F1F5F9;
    padding-left: 18px;
    padding-top: 12px;
    padding-bottom: 3px;
`
const Front = styled.div`
    position: absolute;
`
// const ButtonBox = styled.button`
//     width: 193px;
//     height: 40px;
//     background: #50627F;
//     border-radius: 3px;
//     font-family: 'Noto Sans KR';
//     font-style: normal;
//     font-weight: 700;
//     font-size: 19px;
//     line-height: 26px;
//     color: #F1F5F9;
//     display: flex;
//     align-items: center;
//     padding-left: 6px;
//     :hover{
//         background: #C8D4E6;
//         box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2);
//         font-family: 'Noto Sans KR';
//         font-style: normal;
//         font-weight: 700;
//         line-height: 26px;
//         color: #3A4241;
//         transition: ease-out 0.3s;
//         & ${Front} {
//             display: none;
//         }
//     }
// `

const ButtonBox = styled.button`
    width: 200px;
    height: 50px;
    background: #50627F;
    border-radius: 0px;
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 21px;
    line-height: 26px;
    color: #F1F5F9;
    display: flex;
    align-items: center;
    padding-left: 6px;
    margin-bottom: 5px;
    outline: none;
    border: none;
    transition: background 0.3s ease-out, box-shadow 0.3s ease-out, color 0.3s ease-out; /* 트랜지션 추가 */

    &:hover {
        background: #C8D4E6;
        box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2);
        color: #3A4241;
    }

`;

const ButtonBoxHover = styled.button`
    width: 200px;
    height: 50px;
    background: #C8D4E6;
    border-radius: 0px;
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    font-size: 21px;
    line-height: 26px;
    color: #3A4241;
    display: flex;
    align-items: center;
    padding-left: 6px;
    margin-bottom: 5px;
    outline: none;
    border: none;
    box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2);
    transition: background 0.3s ease-out, box-shadow 0.3s ease-out, color 0.3s ease-out; /* 트랜지션 추가 */

`;

const Buttondiv = styled.div`
    padding-left: 0px;
    padding-bottom: 9px;
`

const Buttontext = styled.div`
    padding-left: 12px;
    padding-bottom: 3px;
`

const ImgTest = styled.div`
    position: relative;

`

const Helpbox = styled.div`
    padding-top: 200px;
`

const Buttons = styled.div`
    margin-top: 20px;
`

function NavButton({props, navigateto}) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(navigateto); // navigateto prop을 navigate 함수에 전달
    };
    return(
        <ButtonBox onClick={handleClick}>
            <Buttontext>{props}</Buttontext>
        </ButtonBox>
    )
};

function NavButtonInpage({props, navigateto}) {
    const navigate = useNavigate();

    return(
        <ButtonBoxHover>
            <Buttontext>{props}</Buttontext>
        </ButtonBoxHover>
    )
};

function SideBar({menu}) {
    const [userName, setUserName] = useRecoilState(userNameAtom);
    const [userEmail, setUserEmail] = useRecoilState(userEmailAtom);
    const [bojId, setBojId] = useRecoilState(bojIdAtom);
    const menuItems = ['HOME', '푼 문제', '틀린 문제', '내 풀이', 'Q & A'];
    const link = ['/main', '/solved', '/wrong', '/solutions', '/qanda'];

    const UserName = userName;
    return(
        <>
            <Sidebarbox>
                <User>USER</User>
                <UserDataBox>
                    <UserNames>{UserName}</UserNames>
                    <UserAffiliatedUnit>BOJ ID: {bojId}</UserAffiliatedUnit>
                    <Line></Line>
                </UserDataBox>
                <NavBox>
                    <NavInfo>MENU</NavInfo>  
                    <Buttons>
                    {menuItems.map((item, index) => (
    
                            <Buttondiv key={item}>
                                {menu === item ? (
                                    <NavButtonInpage props={item}></NavButtonInpage>
                                ) : (
                                    <NavButton 
                                    props={item} 
                                    navigateto={link[index]}
                                    />
                                )}
                            </Buttondiv>
                        ))}
                    </Buttons>
                </NavBox>
                <Helpbox>
                <Line></Line>
                <NavBox>
                    <NavInfo>Help</NavInfo>   
                    <Buttondiv><NavButton props={'설정'}></NavButton></Buttondiv>
                </NavBox>
                </Helpbox>
                <div></div>
            </Sidebarbox>
        </>
    )
}

export default SideBar;