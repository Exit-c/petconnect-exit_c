import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  setCheckedCategory,
  setContent,
  setImgPreviews,
  setTitle,
} from '../../redux/reducers/communityReducer';
import { useNavigate } from 'react-router-dom';
import { authService, dbService, storage } from '../../fbase';
import { doc, addDoc, getDoc, collection } from 'firebase/firestore';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

const StyleWriting = styled.div`
  width: 970px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 10px;

  .write-title {
    font-size: 17px;
    margin-top: 35px;
    span {
      color: red;
    }
  }

  .write-radioWrap {
    input[type='radio'] {
      display: none;
    }
    input[type='radio'] + label {
      position: relative;
      display: inline-block;
      width: 70px;
      height: 30px;
      text-align: center;
      line-height: 33px;
      border-radius: 20px;
      background-color: #f3f3f3;
      margin-right: 10px;
      font-size: 14px;
    }
    input[type='radio']:checked + label {
      background-color: #f7f791;
      z-index: 1;
    }
  }

  .write-textWrap {
    input {
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      border-radius: 10px;
      border: 1px solid #ccc;
      padding-left: 10px;
      font-size: 14px;
      margin-bottom: 10px;
    }
    textarea {
      width: 100%;
      height: 300px;
      box-sizing: border-box;
      border-radius: 10px;
      border: 1px solid #ccc;
      padding-left: 10px;
      font-size: 14px;
      padding: 10px;
      resize: none;
    }
  }

  .write-imgWrap {
    .write-imgBox {
      box-sizing: inherit;
      height: 112px;
      margin: 16px 0 20px;
      padding: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: #fff5ce;
      border: 1px dashed #868688;
      border-radius: 15px;
      text-align: center;
      color: #f24147;
      .write-imgContainer {
        width: 100px;
        height: 100px;
        overflow: hidden;
        margin-right: 20px;
      }
      img {
        width: 100px;
      }
    }

    input[type='file'] {
      display: none;
    }
    label {
      display: inline-block;
      width: 70px;
      height: 30px;
      background-color: #f3f3f3;
      font-size: 12px;
      text-align: center;
      line-height: 30px;
      border-radius: 20px;
    }
    .uproad-info {
      font-size: 14px;
      margin-left: 10px;
      color: #ccc;
    }
  }

  .write-registerWrap {
    display: flex;
    justify-content: center;
    padding: 50px;
    button {
      width: 200px;
      height: 40px;
      margin: 0 auto;
      border: none;
      border-radius: 20px;
      font-weight: bold;
      cursor: pointer;
    }
  }
`;

const Writing = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { checkedCategory, imgPreviews, title, content } = useAppSelector(
    (state) => state.community
  );

  const [imgFiles, setImgFiles] = useState<File[]>([]);

  const imgRef = useRef<HTMLInputElement>(null); // useRef에 제네릭 타입으로 HTMLInputElement를 전달하여 null일 수 있다고 명시

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCheckedCategory(event.target.value));
  };

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  const onChangeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setContent(event.target.value));
  };

  // 이미지 업로드 이벤트
  const handleImgUpload = () => {
    if (imgRef.current && imgRef.current.files) {
      // imgRef.current가 null이 아니고 files 속성이 존재하는지 확인합니다.
      const newFiles = Array.from(imgRef.current.files).slice(0, 5); // 새로 선택된 파일들을 배열로 변환 , 최대 5개 파일 선택
      let updatedFiles = [...imgFiles, ...newFiles]; // 기존 파일과 새로 선택된 파일을 합친 배열 생성
      if (updatedFiles.length > 5) {
        updatedFiles = updatedFiles.slice(0, 5); // 최대 5개 파일 유지
      }
      setImgFiles(updatedFiles); // 선택된 이미지 파일 배열 상태 업데이트

      const fileURLs = updatedFiles.map((file) => URL.createObjectURL(file)); // 파일 URL 배열 생성
      dispatch(setImgPreviews(fileURLs)); // 이미지 미리보기 URL 배열 상태 업데이트
    }
  };

  const onSubmitWriting = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = authService.currentUser; // 현재 사용자
    if (user) {
      // 이미지 파일 업로드
      const uploadTasks = imgFiles.map((file) => {
        const storageRef = ref(storage, 'images/' + file.name); // 이미지 파일을 저장할 경로
        return uploadBytes(storageRef, file); // 이미지 파일 업로드 작업
      });

      // 현재 유저의 닉네임 값을 가져오기 위한 작업
      const userDoc = doc(dbService, 'userNickname', user.uid); // user.uid를 가진 특정 문서에 대한 참조를 생성
      const userSnapshot = await getDoc(userDoc);
      const data = userSnapshot.data();

      await Promise.all(uploadTasks).then(async (snapshots) => {
        // 모든 이미지 파일 업로드가 완료된 경우
        const downloadURLs = await Promise.all(
          snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
        ); // 업로드된 이미지 파일들의 다운로드 URL 배열

        await addDoc(collection(dbService, 'userWrite'), {
          checkedCategory: checkedCategory,
          title: title,
          content: content,
          imgPreviews: downloadURLs,
          userNickname: data ? data.nickname : null, // 닉네임이 있으면 nickname값을 주고 없으면 null
          userEmail: user.email,
          createAt: Date.now(),
        });
      });
    }
    dispatch(setCheckedCategory('강아지'));
    dispatch(setTitle(''));
    dispatch(setContent(''));
    setImgFiles([]);
    dispatch(setImgPreviews([]));
    navigate('/community');
  };
  return (
    <StyleWriting>
      <form onSubmit={onSubmitWriting}>
        <h2 className="write-title">
          <span>*</span>카테고리
        </h2>
        <div className="write-radioWrap">
          <input
            type="radio"
            value="강아지"
            id="강아지"
            checked={checkedCategory === '강아지'}
            onChange={handleChangeCategory}
          />
          <label htmlFor="강아지">강아지</label>
          <input
            type="radio"
            value="고양이"
            id="고양이"
            checked={checkedCategory === '고양이'}
            onChange={handleChangeCategory}
          />
          <label htmlFor="고양이">고양이</label>
          <input
            type="radio"
            value="소동물"
            id="소동물"
            checked={checkedCategory === '소동물'}
            onChange={handleChangeCategory}
          />
          <label htmlFor="소동물">소동물</label>
          <input
            type="radio"
            value="기타"
            id="기타"
            checked={checkedCategory === '기타'}
            onChange={handleChangeCategory}
          />
          <label htmlFor="기타">기타</label>
        </div>
        <h2 className="write-title">
          <span>*</span>글 작성
        </h2>
        <div className="write-textWrap">
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={onChangeTitle}
          />
          <textarea
            placeholder="10자 이상의 글 내용을 입력해주세요."
            value={content}
            onChange={onChangeContent}
          ></textarea>
        </div>
        <h2 className="write-title">사진 업로드</h2>
        <div className="write-imgWrap">
          <div className="write-imgBox">
            {imgPreviews.map((previewURL, index) => (
              <div className="write-imgContainer">
                <img key={index} src={previewURL} alt="업로드 이미지" />
              </div>
            ))}
          </div>
          <input
            id="uploadFile"
            type="file"
            ref={imgRef}
            multiple
            accept="image/jpg,image/png,image/jpeg,image/gif"
            onChange={handleImgUpload}
          />
          <label htmlFor="uploadFile">
            <div>사진 첨부</div>
          </label>
          <span className="uproad-info">
            개당 업로드 용량 10MB이하, 사진 업로드 5개까지 가능합니다.
          </span>
        </div>
        <div className="write-registerWrap">
          <button type="submit">글 등록</button>
        </div>
      </form>
    </StyleWriting>
  );
};

export default Writing;
