import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenAtom } from '../recoil/token';
import { Space, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProblemCommentModal from './ProblemCommentModal';
  
const FailedProblemTable = () => {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
    const [dataSource, setDataSource] = useState();
    const [bottom, setBottom] = useState('bottomCenter');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProblemId, setSelectedProblemId] = useState(null);
    const handleCommentClick = (problemid) => {
      setSelectedProblemId(problemid);
      setIsModalOpen(true);
    };
    const closeModal = () => {
      setIsModalOpen(false);
    };
    const navigate = useNavigate();

    const columns = [
      {
        title: '문제 번호',
        dataIndex: 'problemid',
        key: 'problemid',
        width: 100,
        render: (text) => <a href={`https://www.acmicpc.net/problem/${text}`} target="_blank" rel="noopener noreferrer">{text}</a>,
      },
      // {
      //   title: 'Comment',
      //   dataIndex: 'problemid',
      //   key: 'problemid',
      //   width: 100,
      //   render: (text) => {
      //     return (<a 
      //       href="#" // 앵커 태그의 기본 동작 방지
      //       onClick={(e) => {
      //         e.preventDefault(); // 앵커 태그의 기본 동작 방지
      //         navigate(`/qanda/${text}`); 
      //       }}
      //     >
      //       {text}
      //     </a>);}
      // },
      {
        title: 'Comment',
        dataIndex: 'problemid',
        key: 'problemid',
        width: 100,
        render: (text) => {
          return (<a 
            href="#" // 앵커 태그의 기본 동작 방지
            onClick={(e) => {
              e.preventDefault(); // 앵커 태그의 기본 동작 방지
              handleCommentClick(text); 
            }}
          >
            {text}
          </a>);}
      },
      {
        title: '제목',
        dataIndex: 'title',
        key: 'title',
        width: 450
      },
      {
        title: '태그',
        key: 'tags',
        dataIndex: 'tags',
        width: 450,
        render: (_, { tags }) => (
          <>
            {tags.map((tag) => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: '티어',
        dataIndex: 'tiers',
        key: 'tiers',
        width: 150
      },
      {
        title: '정답률',
        dataIndex: 'percentage',
        key: 'percentage',
        width: 150
      },
    ];


    useEffect(() => {
        // accessToken을 로컬 스토리지에서 읽어와서 설정
        const token = localStorage.getItem('user');
        const token_request = JSON.parse(token);
        if (token_request) {
            setAccessToken(token_request.accessToken);
        }
    }, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행
    
    useEffect(() => {
        if (accessToken) {
            axios.get("http://localhost:8000/user/problems/failed", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(result => {
                setDataSource(result.data);
            })
        }
    }, [accessToken])

    return(
      <>
        <Table columns={columns} dataSource={dataSource} pagination={{
            position: [bottom]
          }}/>
        <ProblemCommentModal
          isOpen={isModalOpen} 
          onRequestClose={closeModal} 
          problemId={selectedProblemId} 
        />
      </>
    );

}

export default FailedProblemTable;