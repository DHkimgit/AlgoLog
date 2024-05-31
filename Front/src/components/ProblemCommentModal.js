import React, { useState } from 'react';
import Modal from 'react-modal';
import ProblemComment from '../pages/ProblemComment';

const ProblemCommentModal = ({ isOpen, onRequestClose, problemId }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Problem Comment"
      // 모달 스타일 설정
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%', // 모달 너비 설정
          maxWidth: '600px', // 모달 최대 너비 설정
        }
      }}
    >
      {/* 모달 내용 */}
      <h2>문제 {problemId}에 대한 댓글</h2> 
      <ProblemComment problemid={problemId}/> {/* ProblemComment 컴포넌트 렌더링 */}
      <button onClick={onRequestClose}>Close</button> 
    </Modal>
  );
}

export default ProblemCommentModal;