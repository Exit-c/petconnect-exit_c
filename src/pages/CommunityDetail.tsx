import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { dbService } from '../fbase';
import { query, collection, getDocs } from 'firebase/firestore';
import { setUserWriteData } from '../redux/reducers/communityReducer';

const StyleCommunityDetail = styled.div`
  width: 970px;
  margin: 0 auto;
  padding-top: 50px;

  .detail-category {
    width: 80px;
    height: 30px;
    line-height: 34px;
    background-color: #f7f791;
    text-align: center;
    border-radius: 20px;
    font-size: 13px;
    font-weight: bold;
  }

  .detail-title {
    width: 100%;
    word-break: break-all;
    padding-bottom: 30px;
    border-bottom: 1px solid #ccc;
    font-weight: 500;
  }

  .detail-content {
    width: 100%;
    word-break: break-all; // 영역을 벗어나도 줄바꿈이 안될 때 사용
    white-space: pre; // textarea에 입력한 공백과 개행을 그대로 출력
    margin-bottom: 120px;
  }

  .detail-img {
    margin-bottom: 20px;
    img {
      display: block;
      max-width: 445px;
      max-height: 100%;
      margin: 0 auto;
    }
  }

  .detail-nickname {
    display: block;
    margin-top: 100px;
    font-size: 13px;
    width: 100%;
    border-top: 1px solid #ccc;
    padding-top: 20px;
  }

  .detail-date {
    display: block;
    font-size: 13px;
    color: #999;
    padding-bottom: 50px;
  }
`;

const CommunityDetail = () => {
  const { id } = useParams();
  const { userWriteData } = useAppSelector((state) => state.community);
  const dispatch = useAppDispatch();

  // 올린 날짜 년월일 표시하기
  const postedDate = (date: number): string => {
    const start = new Date(date);

    return `${start.toLocaleDateString()}`;
  };

  useEffect(() => {
    const getUserWrite = async () => {
      const q = query(collection(dbService, 'userWrite'));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return { id: doc.id, ...docData };
      });

      dispatch(setUserWriteData(data));
    };

    getUserWrite();
  }, []);

  return (
    <StyleCommunityDetail>
      {userWriteData.map((userData, index) => (
        <div key={index}>
          {userData.id === id && (
            <div>
              <div className="detail-category">{userData.checkedCategory}</div>
              <h2 className="detail-title">{userData.title}</h2>
              <div>
                <p className="detail-content">{userData.content}</p>
                {userData.imgPreviews.map((image: any) => (
                  <div className="detail-img">
                    <img src={image} alt="동물" />
                  </div>
                ))}
                <span className="detail-nickname">
                  {userData.userNickname
                    ? userData.userNickname
                    : userData.userEmail}
                </span>
                <span className="detail-date">
                  {postedDate(userData.createAt)}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </StyleCommunityDetail>
  );
};

export default CommunityDetail;
