import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { accessTokenAtom } from '../recoil/token'; // accessTokenAtom import
import { useRecoilState } from 'recoil';
import ProblemStateAtom from '../recoil/problem';
import axios from 'axios';

const ProblemContainer = styled.div`
  width: 100%;
  padding: 20px;
  border-bottom: 1px solid #eee;
`;

const ProblemTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 10px;
`;

const ProblemPercentage = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

const ProblemTiers = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

const ProblemTags = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const ProblemTag = styled.li`
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #ddd;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 14px;
`;

const CommentsContainer = styled.div`
  margin-top: 20px;
  ${({ commentsCount }) =>
    commentsCount > 8 &&
    `
    max-height: 200px;
    overflow-y: auto;
  `}
`;

const Comment = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const CommentUser = styled.strong`
  margin-right: 10px;
`;

const CommentContent = styled.p`
  margin: 0;
`;

const CommentForm = styled.div`
  display: flex;
  margin-top: 20px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const CommentButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

var stringify = require('qs-stringify');

const Problem = ({ id }) => {
  const [newComment, setNewComment] = useState('');
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [problemData, setProblemData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // accessToken을 로컬 스토리지에서 읽어와서 설정
    const token = localStorage.getItem('user');
    const token_request = JSON.parse(token);
    if (token_request) {
        setAccessToken(token_request.accessToken);
    }
  }, []);
  useEffect(() => {
    if (accessToken) {
        setIsLoading(true);
        axios.get(`http://localhost:8000/comment/page/${id}`)
        .then(result => {
            setProblemData(result.data);
        }
        ).finally(() => {
            setIsLoading(false);
        })
    }
}, [accessToken])

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  const params = {
    'comment': newComment,
    'up': 0,
    'down': 0
};
  const handleSubmitComment = async () => {
    try {
        console.log(params);
      const response = await axios.post(
        `http://localhost:8000/comment/${id}`,params,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // accessToken 헤더 설정
          },
        }
      );
      // 댓글 작성 성공 시, 컴포넌트 리렌더링을 위해 comments 상태 업데이트
      // (더 효율적인 방법은 백엔드에서 새로운 댓글 데이터를 반환받아 comments 배열에 추가하는 것입니다.)
      if (response.status === 200) {
        setNewComment(''); // 입력 필드 초기화
        // comments 상태를 업데이트하여 컴포넌트 리렌더링 트리거
        const token = localStorage.getItem('user');
        const token_request = JSON.parse(token);
        if (token_request) {
            setAccessToken(token_request.accessToken);
        }
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      // 오류 처리 로직 추가 (예: 사용자에게 오류 메시지 표시)
    }
  };

  return (
    <ProblemContainer>
        {isLoading ? (
        <div>Loading...</div> 
      ) : (
        <>
      <ProblemTitle>{problemData.problem.title}</ProblemTitle>
      <ProblemPercentage>
        {problemData.problem.percentage} (추천율)
      </ProblemPercentage>
      <ProblemTiers>StarTrek {problemData.problem.tiers}</ProblemTiers>
      <ProblemTags>
        {problemData.problem.tags.map((tag) => (
          <ProblemTag key={tag}>{tag}</ProblemTag>
        ))}
      </ProblemTags>
      <CommentsContainer commentsCount={problemData.comments.length}>
        {problemData.comments.map((comment) => (
          <Comment key={comment._id}>
            <CommentUser>{comment.username}</CommentUser>
            <CommentContent>{comment.comment}</CommentContent>
          </Comment>
        ))}
        
      </CommentsContainer>
      <CommentForm>
          <CommentInput
            type="text"
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={handleCommentChange}
          />
          <CommentButton onClick={handleSubmitComment}>등록</CommentButton>
        </CommentForm>
      </>
      )}
    </ProblemContainer>

  );
};

export default Problem;