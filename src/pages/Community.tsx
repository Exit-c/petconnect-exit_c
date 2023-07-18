import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUserWriteData } from '../redux/reducers/communityReducer';
import styled from 'styled-components';
import search from '../images/free-icon-finder-4227126.png';
import deleteIcon from '../images/370086_bin_delete_empty_out_recycle_icon.png';
import { authService, dbService } from '../fbase';
import {
  getDocs,
  collection,
  DocumentData,
  orderBy,
  query,
  where,
  limit,
  startAfter,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const StyleCommunity = styled.div`
  width: 970px;
  margin: 0 auto;

  .community-search {
    width: 100%;
    padding-top: 50px;
    input {
      width: 100%;
      height: 50px;
      border: 2px solid #ddd;
      border-radius: 20px;
      padding: 0 20px 0 40px;
      background-image: url(${search});
      background-repeat: no-repeat;
      background-size: 24px;
      background-position: 10px 50%;
      font-size: 16px;
      outline-color: #f7f791;
    }
  }

  .community-radioWrap {
    margin-top: 30px;
    input {
      -webkit-appearance: none;
      -moz-appearance: none;
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.4rem;
      border-radius: 100%;
      border: 2px solid #ccc;
    }

    input:checked {
      border: 3px solid #f7f791;
    }

    label {
      margin-right: 15px;
      font-size: 13px;
      position: relative;
      top: -2px;
    }
  }
  .community-display {
    display: none;
  }
  .community-writeWrap {
    width: 100%;
    height: 200px;
    border-bottom: 1px solid #ccc;
    margin-top: 40px;
    margin-bottom: 20px;
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;

    .community-delete {
      position: absolute;
      top: 4px;
      right: 0;
      cursor: pointer;
      opacity: 0;
      transition: 0.2s;
      img {
        width: 20px;
      }
    }
    &:hover {
      .community-delete {
        opacity: 1;
      }
    }

    .commnunity-category {
      display: block;
      width: 80px;
      height: 30px;
      line-height: 34px;
      background-color: #f7f791;
      text-align: center;
      border-radius: 20px;
      font-size: 13px;
      font-weight: bold;
    }
    .community-contentWrap {
      width: 80%;
      height: 130px;
      float: left;
      box-sizing: border-box;
      h4 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      p {
        font-size: 14px;
        color: #666;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
    .community-imageWrap {
      float: right;
      width: 20%;
      height: 130px;
      box-sizing: border-box;
      padding-right: 20px;
      img {
        width: 130px;
        height: 130px;
        border-radius: 20px;
        float: right;
        object-fit: cover;
      }
    }
    .community-bottomWrap {
      clear: both;
      padding-top: 10px;
      span {
        margin-right: 30px;
        font-size: 14px;
        color: #666;
      }
    }
  }
  .community-more {
    text-align: center;
    font-size: 18px;
    color: #666;
    padding: 30px;
    span {
      cursor: pointer;
    }
  }
  .community-null {
    font-size: 20px;
    color: #999;
    width: 100%;
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Community = () => {
  const navigete = useNavigate();
  const dispatch = useAppDispatch();
  const { userWriteData } = useAppSelector((state) => state.community);

  // 최신순, 내가작성한글 상태
  const [radio, setRadio] = useState<string>('최신순');
  // 검색 상태
  const [keyword, setKeyword] = useState<string>('');
  // 글 바꾸기
  const [text, setText] = useState<string>('');
  // 마지막으로 불러온 스냅샷 상태
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  // 더보기 버튼 상태
  const [moreButton, setMoreButton] = useState<string>('더보기');
  // 글 삭제 상태
  const [showDisplay, setShowDisplay] = useState<string>('');
  // 현재 사용자
  const user = authService.currentUser;

  // 글 작성 후 방금 전, 몇 분 전, 몇 시간 전 형식으로 표시하기
  const elapsedTime = (date: number): string => {
    const start = new Date(date);
    const end = new Date();

    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (seconds < 60) return '방금 전';

    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;

    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;

    return `${start.toLocaleDateString()}`;
  };

  // 최신순, 내가 작성한 글 필터링
  const handleClickRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadio(event.target.value);
  };

  // 검색 키워드 가져오기
  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
  // 제목 검색하기
  const onSubmitSearch = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (keyword !== '' && event.key === 'Enter') {
      let q;
      if (radio === '최신순') {
        q = query(
          collection(dbService, 'userWrite'),
          where('title', '>=', keyword),
          where('title', '<=', keyword + '\uf8ff')
        );
      } else if (radio === '내가작성한글' && user && user.email) {
        q = query(
          collection(dbService, 'userWrite'),
          where('title', '>=', keyword),
          where('title', '<=', keyword + '\uf8ff'),
          where('userEmail', '==', user.email)
        );
      }

      if (q) {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return { id: doc.id, ...docData };
        });
        dispatch(setUserWriteData(data));
        setKeyword('');
        setText('검색하신 결과가 없습니다');
      }
    }
  };

  // 더보기를 누를 경우 추가 데이터 받아오기
  const onClickMore = async () => {
    if (lastVisible) {
      let q;
      if (radio === '최신순') {
        q = query(
          collection(dbService, 'userWrite'),
          orderBy('createAt', 'desc'),
          startAfter(lastVisible),
          limit(4)
        );
      } else if (radio === '내가작성한글' && user && user.email) {
        q = query(
          collection(dbService, 'userWrite'),
          where('userEmail', '==', user.email),
          orderBy('createAt', 'desc'),
          startAfter(lastVisible),
          limit(4)
        );
      }

      if (q) {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return { id: doc.id, ...docData };
        });

        if (data.length > 0) {
          dispatch(setUserWriteData([...userWriteData, ...data])); // 기존 데이터를 유지하면서 새로운 데이터 추가
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } else {
          setMoreButton('마지막 글입니다'); // 데이터가 없을 경우 '마지막 글입니다'로 알려줌
        }
      }
    }
  };

  // 내가 작성한 글 삭제하기
  const onClickDelete = async (id: string) => {
    alert('글이 삭제되었습니다');
    await deleteDoc(doc(dbService, 'userWrite', id));
    setShowDisplay(id);
  };

  // CommunityDetail 페이지로 이동하기
  const goToDetail = (id: string) => {
    navigete(`/community/${id}`);
  };

  useEffect(() => {
    const getUserWrite = async () => {
      if (radio === '최신순') {
        const q = query(
          collection(dbService, 'userWrite'),
          orderBy('createAt', 'desc'),
          limit(4) // 최신순으로 정렬
        );
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return { id: doc.id, ...docData };
        });

        dispatch(setUserWriteData(data));
        setText('첫 게시글의 주인공이 되어주세요!');
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setMoreButton('더보기');
      } else if (radio === '내가작성한글') {
        if (user && user.email) {
          const q = query(
            collection(dbService, 'userWrite'),
            where('userEmail', '==', user.email),
            orderBy('createAt', 'desc'),
            limit(4) // 최신순으로 정렬
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => {
            const docData = doc.data();
            return { id: doc.id, ...docData };
          });

          dispatch(setUserWriteData(data));
          setText('글을 작성해주세요!');
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setMoreButton('더보기');
        } else {
          // 로그인 상태가 아닐 시
          alert('로그인이 필요합니다.');
          navigete('/login');
        }
      }
    };

    getUserWrite();
  }, [radio]);

  return (
    <StyleCommunity>
      <div className="community-search">
        <input
          type="search"
          placeholder="찾는 커뮤니티 글을 입력하세요"
          value={keyword}
          onChange={onChangeSearch}
          onKeyDown={onSubmitSearch}
        />
      </div>
      <div className="community-radioWrap">
        <input
          type="radio"
          id="최신순"
          value="최신순"
          checked={radio === '최신순'}
          onChange={handleClickRadio}
        />
        <label htmlFor="최신순">최신 순</label>
        <input
          type="radio"
          id="내가작성한글"
          value="내가작성한글"
          checked={radio === '내가작성한글'}
          onChange={handleClickRadio}
        />
        <label htmlFor="내가작성한글">내가 작성한 글</label>
      </div>
      {userWriteData.length !== 0 ? (
        <div>
          {userWriteData.map((userData, index) => {
            return (
              <div
                className={
                  userData.id === showDisplay
                    ? 'community-display'
                    : 'community-writeWrap'
                }
                key={index}
              >
                <span className="commnunity-category">
                  {userData.checkedCategory}
                </span>
                {radio === '내가작성한글' && (
                  <span
                    className="community-delete"
                    onClick={() => onClickDelete(userData.id)}
                  >
                    <img src={deleteIcon} alt="쓰레기통" />
                  </span>
                )}
                <div className="community-contentWrap">
                  <h4 onClick={() => goToDetail(userData.id)}>
                    {userData.title}
                  </h4>
                  <p onClick={() => goToDetail(userData.id)}>
                    {userData.content}
                  </p>
                </div>
                <div className="community-imageWrap">
                  {userData.imgPreviews[0] && (
                    <img src={userData.imgPreviews[0]} alt="커뮤니티이미지" />
                  )}
                </div>
                <div className="community-bottomWrap">
                  <span>
                    {userData.userNickname
                      ? userData.userNickname
                      : userData.userEmail}
                  </span>
                  <span>{elapsedTime(userData.createAt)}</span>
                </div>
              </div>
            );
          })}
          {userWriteData.length >= 4 && (
            <div className="community-more">
              <span onClick={onClickMore}>{moreButton}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="community-null">{text}</div>
      )}
    </StyleCommunity>
  );
};

export default Community;
