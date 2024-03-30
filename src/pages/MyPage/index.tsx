import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService, dbService } from '../../fbase';
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import cat from '../../images/animal-2029245_640.png';

const StyleMyPage = styled.div`
  width: 320px;
  margin: 0 auto;
  padding-top: 100px;

  .mypage-title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 50px;
  }

  .mypage-nicknameWrap {
    width: 100%;
    margin-bottom: 30px;
    span {
      font-weight: bold;
      margin-right: 10px;
    }
    input {
      border: none;
      color: #666;
      outline: none;
    }
    div {
      width: 100%;
      height: 2px;
      background-color: #f7f791;
      margin-top: 10px;
    }
  }

  .mypage-emailWrap {
    width: 100%;

    input {
      border: none;
      color: #666;
      outline: none;
    }
    div {
      width: 100%;
      height: 2px;
      background-color: #f7f791;
      margin-top: 10px;
    }
  }

  .mypage-nicknameChange {
    width: 100%;
    height: 40px;
    margin-top: 25px;
    border: none;
    background-color: #f7f791;
    border-radius: 20px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
  }

  .mypage-line {
    width: 100%;
    height: 2px;
    background-color: #f7f791;
    margin-top: 20px;
  }

  .mypage-logout {
    width: 30%;
    height: 30px;
    border: none;
    border-radius: 20px;
    margin-top: 10px;
    background-color: #f7f791;
    font-size: 12px;
    cursor: pointer;
  }

  .mypage-withdraw {
    display: block;
    float: right;
    width: 20%;
    height: 30px;
    border: none;
    border-radius: 20px;
    margin-top: 10px;
    background-color: #fff;
    font-size: 12px;
    color: #999;
    cursor: pointer;
  }
`;

const StyleMyPageModal = styled.div`
  width: 400px;
  height: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 2px solid #f7f791;
  border-radius: 20px;
  padding: 40px;

  .modal-img {
    width: 200px;
    margin: 0 auto;
    display: block;
    margin-bottom: 70px;
  }
  .modal-label {
    margin-right: 5px;
    font-size: 20px;
    display: block;
    text-align: center;
    margin-bottom: 20px;
  }
  .modal-input {
    width: 100%;
    border: none;
    outline: none;
    color: #666;
    font-size: 20px;
    text-align: center;
  }
  .modal-line {
    width: 100%;
    height: 2px;
    background-color: #ccc;
    margin-top: 10px;
  }
  .modal-create {
    width: 100%;
    height: 40px;
    border: none;
    border-radius: 20px;
    background-color: #f7f791;
    font-weight: bold;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
  }
  .modal-close {
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    margin-top: 60px;
    border: 2px solid #ccc;
    border-radius: 10px;
    background-color: #fcfcfc;
  }
  .modal-close:hover {
    background-color: #f7f791;
  }
`;

const MyPage = () => {
  const navigate = useNavigate();

  // userEmail 상태
  const [userEmail, setUserEmail] = useState<string>('');
  // modal 표시 상태
  const [showModal, setShowModal] = useState<boolean>(false);
  // user 닉네임 상태
  const [userNickname, setUserNickname] = useState<string>('');
  // 유저의 이메일값 가져오기
  useEffect(() => {
    // onAuthStateChanged()는 사용자의 로그인 상태 변화를 감지하는 메서드
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email || '');

        const userDoc = doc(dbService, 'userNickname', user.uid); // user.uid를 가진 특정 문서에 대한 참조를 생성
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserNickname(data.nickname);
        } else {
          setUserNickname('');
        }
      } else {
        setUserEmail('');
        setUserNickname('');
      }
    });

    // return문을 사용하여 cleanup 함수를 명시적으로 반환 - 이전 렌더링에서 처리한 작업을 정리하고 리소스를 해제하는 역할
    return () => {
      unsubscribe();
    };
  }, []);

  // 모달창 생성
  const onNicknameChangeClick = () => setShowModal(true);
  // 모달창 닫기
  const onModalClose = () => setShowModal(false);

  const onChangeNickname = (event: ChangeEvent<HTMLInputElement>) =>
    setUserNickname(event.target.value);

  const onSubmitNickname = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 닉네임 유효성 검사
    if (userNickname.trim() === '') {
      // 닉네임이 비어있는 경우
      alert('닉네임을 입력해주세요');
      return;
    }
    // 중복 닉네임 확인을 위해 Firestore에서 해당 닉네임을 검색
    const querySnapshot = await getDocs(
      query(
        collection(dbService, 'userNickname'),
        where('nickname', '==', userNickname) // firestore 에 저장된 닉네임과 입력한 닉네임이 일치하는지 확인
      )
    );
    if (!querySnapshot.empty) {
      alert('이미 사용중인 닉네임입니다. 다른 닉네임을 선택해주세요.');
      return;
    }

    const user = authService.currentUser; // 현재 사용자
    if (user) {
      // Firestore에 닉네임 생성 및 변경
      const userDoc = doc(dbService, 'userNickname', user.uid);
      await setDoc(userDoc, { nickname: userNickname });
    }

    setShowModal(false);
  };
  // 로그아웃 클릭이벤트
  const onLogOutClick = () => {
    authService.signOut();
    navigate('/login');
  };

  // 회원탈퇴 클릭이벤트
  const onWithdrawClick = async () => {
    const user = authService.currentUser; // 현재 사용자

    if (user) {
      // Firestore에서 해당 사용자의 닉네임 문서 삭제
      const userDoc = doc(dbService, 'userNickname', user.uid);
      await deleteDoc(userDoc);

      // 사용자 계정 삭제
      await user.delete();

      // 로그아웃
      authService.signOut();
      navigate('/login');
    }

    alert('회원탈퇴가 정상적으로 완료되었습니다');
  };

  return (
    <>
      <StyleMyPage>
        <h2 className="mypage-title">내 프로필</h2>
        <div className="mypage-nicknameWrap">
          <span>닉네임</span>
          <input
            type="text"
            placeholder="닉네임을 생성해주세요."
            value={userNickname}
            readOnly
          />
          <div></div>
        </div>
        <div className="mypage-emailWrap">
          <input type="text" value={userEmail} readOnly />
          <div></div>
        </div>
        <button
          type="button"
          className="mypage-nicknameChange"
          onClick={onNicknameChangeClick}
        >
          닉네임 변경
        </button>
        <div className="mypage-line"></div>
        <button type="button" className="mypage-logout" onClick={onLogOutClick}>
          로그아웃
        </button>
        <button
          type="button"
          className="mypage-withdraw"
          onClick={onWithdrawClick}
        >
          회원탈퇴
        </button>
      </StyleMyPage>
      {showModal && (
        <StyleMyPageModal>
          <img src={cat} alt="고양이" className="modal-img" />
          <form onSubmit={onSubmitNickname}>
            <label htmlFor="nickname" className="modal-label">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력해주세요"
              className="modal-input"
              maxLength={10}
              onChange={onChangeNickname}
            />
            <div className="modal-line"></div>
            <button type="submit" className="modal-create">
              변경하기
            </button>
          </form>
          <button type="button" onClick={onModalClose} className="modal-close">
            X
          </button>
        </StyleMyPageModal>
      )}
    </>
  );
};

export default MyPage;
