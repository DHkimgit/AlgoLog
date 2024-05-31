import React, { useState } from 'react';
import Modal from 'react-modal';

const LoginFailedModal = ({ isOpen, onRequestClose}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="LoginFailed"
      // 모달 스타일 설정
      style={{
        content: {
          top: '20%',
          left: '20%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-20%',
          transform: 'translate(-50%, -50%)',
          width: '40%', // 모달 너비 설정
          maxWidth: '600px', // 모달 최대 너비 설정
        }
      }}
    >
      {/* 모달 내용 */}

      <div>로그인 실패</div>

    </Modal>
  );
}

export default LoginFailedModal;