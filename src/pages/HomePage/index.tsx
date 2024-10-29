import { Link } from "react-router-dom";
import styled from "styled-components";
import cat_img from "../../images/cat-5098930_1280.jpg";
import dog_img from "../../images/dog-3389729_1280.jpg";

const StyleHome = styled.div`
  .container {
    position: relative;
    display: flex;
    width: 100%;
  }

  .pet-img01,
  .pet-img02 {
    width: 50%;
    img {
      width: 100%;
    }
  }

  .community-botton {
    width: 20vw;
    height: 6vw;
    position: absolute;
    top: 60vw;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f7f791;
    border: none;
    border-radius: 10px;
    font-size: 2vw;
    text-transform: capitalize;
    cursor: pointer;

    .community-link {
      color: #000;
      text-decoration: none;
    }
  }

  @media (min-width: 768px) {
    .container {
      position: relative;
      display: flex;
      width: 100%;
    }
  }

  .position-box {
    position: absolute;
    top: 15vw;
    left: 50%;
    transform: translate(-50%, -50%);

    .pet-text {
      color: #fff;
      font-size: 2vw;
      text-align: center;
      span {
        display: block;
        text-align: center;
        font-size: 4vw;
        margin-top: 1vw;
        font-weight: bold;
      }
    }
  }

  @media (min-width: 970px) {
    width: 970px;
    margin: 0 auto;
    padding: 0;

    .position-box {
      position: absolute;
      top: 200px;
      left: 50%;
      transform: translate(-50%, -50%);

      .pet-text {
        color: #fff;
        font-size: 20px;
        text-align: center;
        span {
          display: block;
          text-align: center;
          font-size: 36px;
          margin-top: 12px;
          font-weight: bold;
        }
      }
    }

    .community-botton {
      width: 200px;
      height: 50px;
      position: absolute;
      top: 600px;
      left: 50%;
      transform: translate(-50%, -50%);
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
      <div className="container">
        <div className="pet-img01">
          <img src={dog_img} alt="dog_image" />
        </div>
        <div className="pet-img02">
          <img src={cat_img} alt="cat_image" />
        </div>
        <div className="position-box">
          <p className="pet-text">
            반려인들의 소통공간 <span>Petconnect</span>
          </p>
        </div>
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
