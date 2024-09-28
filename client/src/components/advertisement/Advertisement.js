import React from "react";
import Adimg from "../../asset/info4.jpeg";
import "./Advertisement.scss";
import { useSelector } from "react-redux";

function Advertisement() {
  const isDarkMode = useSelector((state) => {
    return state.appConfigReducer.isDarkMode;
  });

  return (
    <div className="advertisement">
      <div className="Title">
        <h4 style={isDarkMode ? { color: "white" } : {}}>Sponsored</h4>
        <p style={isDarkMode ? { color: "#999" } : {}}>Create ads</p>
      </div>
      <div className="Img">
        <div className="image-con">
          <img src={Adimg} alt="sponsored" />
        </div>
      </div>
      <div className="paragraph">
        <h4 style={isDarkMode ? { color: "white" } : {}}>MikaCosmetics</h4>
        <p style={isDarkMode ? { color: "#999" } : {}}>mikacosmetics.com</p>
      </div>
      <div className="disc">
        <p style={isDarkMode ? { color: "#999" } : {}}>
          {" "}
          Your pathway to stunning and immaculate beauty and made sure your skin
          is exfoliating skin and shining like light.
        </p>
      </div>
    </div>
  );
}

export default Advertisement;
