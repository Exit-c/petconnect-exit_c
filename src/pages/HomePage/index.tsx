import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyleHome = styled.div`
  width: 970px;
  margin: 0 auto;
  position: relative;

  .pet-img01,
  .pet-img02 {
    width: 50%;
    height: 800px;
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
  }
  .pet-img01 {
    background-image: url(${require('../../images/dog-3389729_1280.jpg')});
    border-radius: 10px 0 0 10px;
  }
  .pet-img02 {
    background-image: url(${require('../../images/cat-5098930_1280.jpg')});
    border-radius: 0 10px 10px 0;
  }
  .pet-img01:after,
  .pet-img02:after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
  }

  .position-box {
    width: 300px;
    height: auto;
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translate(-50%, -50%); // 중간정렬

    .pet-text {
      color: #fff;
      font-size: 25px;
      text-align: center;
      span {
        display: block;
        text-align: center;
        font-size: 35px;
        margin-top: 10px;
        font-weight: bold;
      }
    }

    .community-botton {
      width: 200px;
      height: 50px;
      position: absolute;
      top: 550px;
      left: 50%;
      transform: translate(-50%, -50%); // 중간정렬
      background-color: #f7f791;
      border: none;
      border-radius: 10px;
      font-size: 20px;
      text-transform: capitalize;
      cursor: pointer;

      .community-link {
        color: #000;
        text-decoration: none;
      }
    }
  }
`;

const Home = () => {
  return (
    <StyleHome>
      <div className="pet-img01"></div>
      <div className="pet-img02"></div>
      <div className="position-box">
        <p className="pet-text">
          반려인들의 소통공간 <span>Petconnect</span>
        </p>
        <button className="community-botton">
          <Link to="/community" className="community-link">
            community
          </Link>
        </button>
      </div>
    </StyleHome>
  );
};

export default Home;
