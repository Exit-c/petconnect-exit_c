import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const StyleNavigation = styled.div`
  width: 100%;

  .container {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    font-weight: bold;
    box-sizing: border-box;

    .h-logo {
      width: 105px;
      font-size: 20px;
      cursor: pointer;
    }

    .navigation {
      display: flex;
      justify-content: space-between;
      width: 45vw;
      height: 20px;
      list-style: none;
      li {
        cursor: pointer;
      }
      li:hover {
        border-bottom: 3px solid #f7f791;
      }
    }

    .write {
      width: 90px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      background-color: #f7f791;
      border-radius: 30px;
      border: none;
      margin-top: 7px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
    }

    .link {
      text-decoration: none;
      color: #000;
    }
  }

  @media (min-width: 970px) {
    .container {
      width: 970px;
      margin: 0 auto;
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      box-sizing: border-box;

      .h-logo {
        width: 105px;
        font-size: 20px;
        cursor: pointer;
      }
      .navigation {
        display: flex;
        justify-content: space-between;
        width: 500px;
        height: 20px;
        list-style: none;
        li {
          cursor: pointer;
        }
        li:hover {
          border-bottom: 3px solid #f7f791;
        }
      }
      .write {
        width: 90px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        background-color: #f7f791;
        border-radius: 30px;
        border: none;
        margin-top: 7px;
        font-size: 16px;
        cursor: pointer;
        font-weight: bold;
      }

      .link {
        text-decoration: none;
        color: #000;
      }
    }
  }
`;
interface OwnProps {
  isLoggedIn: boolean;
}

const Navigation: React.FC<OwnProps> = ({ isLoggedIn }) => {
  let navigate = useNavigate();

  const handleClickWrite = () => {
    if (isLoggedIn) {
      navigate("/writing");
    } else {
      alert("로그인이 필요합니다");
      navigate("/login");
    }
  };
  return (
    <StyleNavigation>
      <div className="container">
        <h1 className="h-logo">
          <Link to="/" className="link">
            petconnect
          </Link>
        </h1>
        <nav>
          <ul className="navigation">
            <li>
              <Link to="/" className="link">
                홈
              </Link>
            </li>
            <li>
              <Link to="/community" className="link">
                커뮤니티
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <Link to="/mypage" className="link">
                  마이페이지
                </Link>
              ) : (
                <Link to="/login" className="link">
                  로그인
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <button className="write" onClick={handleClickWrite}>
          글쓰기
        </button>
      </div>
    </StyleNavigation>
  );
};

export default Navigation;
