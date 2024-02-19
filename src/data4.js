import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AWS from "aws-sdk";
import "./data4.css";

// Set your AWS region and access key ID/secret access key
const AWS_ACCESS_KEY_ID = "AKIAU6GDW6NRHQDXHTOT";
const AWS_SECRET_ACCESS_KEY = "UOlkSdE5HPhXLXdHA/Zro8508mIf2VLag5vj3eIc";
const AWS_REGION = "ap-south-1";

AWS.config.update({
  region: AWS_REGION,
  credentials: new AWS.Credentials({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  }),
});

const docClient = new AWS.DynamoDB.DocumentClient();

const Confo = () => {
  const [confessionPost, setConfessionPost] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [confessionNumber, setConfessionNumber] = useState(0);
  const [confessions, setConfessions] = useState([]);
  const top = useRef(null);

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleInputChange = (event) => {
    setConfessionPost(event.target.value);
  };

  const handleAddItem = () => {
    const params = {
      TableName: "confession",
      ScanIndexForward: false,
      Limit: 1,
    };

    docClient.scan(params, (err, data) => {
      if (err) {
        console.error(
          "Unable to scan table for the latest item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        const newItemParams = {
          TableName: "confession",
          Item: {
            number: confessionNumber,
            post: confessionPost,
          },
        };

        docClient.put(newItemParams, (putErr, putData) => {
          if (putErr) {
            console.error(
              "Unable to add item. Error JSON:",
              JSON.stringify(putErr, null, 2)
            );
          } else {
            setResponseData(putData);
            handleGetItems();
          }
        });
      }
    });
  };

  const handleGetItems = () => {
    const params = {
      TableName: "confession",
    };

    docClient.scan(params, (err, data) => {
      if (err) {
        console.error(
          "Unable to scan table. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        const sortedConfessions = data.Items.sort(
          (a, b) => b.number - a.number
        );
        setConfessions(sortedConfessions);
        const lastItem = data.Items.length > 0 ? data.Items.length : 0;
        const confessionNumber = lastItem;
        setConfessionNumber(confessionNumber);
      }
    });
  };

  useEffect(() => {
    handleGetItems();
  }, []);

 
  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.8)",
      transition: {
        duration: 0.3,
      },
    },
    fire: {
      backgroundColor: "#FF5722", // Fiery color
      boxShadow: "0px 0px 20px rgba(255, 165, 0, 0.8)", // Fiery shadow
      transition: {
        duration: 0.3,
      },
    },
  };


  const FlyIn = () => {};

  return (
    <div className="con" ref={top}>
        <img src="jk.png" alt="joker" className="jkimg"></img>
        <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          zIndex:"99"
        }}
        ref={top}
      >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h2 className="hee3" style={{zIndex:"99", fontFamily: 'Gothic, sans-serif',}}>Confessions</h2>

            <label>
              <textarea
                className="tarea3"
                rows={5}
                type="text"
                name="confessionPost"
                value={confessionPost}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <motion.button
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                zIndex:"99"
              }}
              whileHover="hover"
              variants={buttonVariants}
              initial="initial"
              animate="initial"
              onClick={() => {
                handleAddItem();
                FlyIn();
              }}
            >
              Submit
            </motion.button>
          </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          {confessions.map((confession, index) => (
            <div
              key={confession.number}
              className="l_name3"
              style={{
                fontFamily: "Comic Sans MS",
                fontSize: "20px",
                color: "#000000",
                opacity:"0.7"
              }}
            >
              {confession.post}
            </div>
          ))}
        </div>
        <img
          src="up.png"
          onClick={() => {
            scrollToRef(top);
          }}
          alt="tree"
          style={{
            position: "fixed",
            right: "0",
            bottom: "0",
            width: "40px",
            margin: "10px",
          }}
        />
      </div>
      </div>
    </div>
  );
};

export default Confo;
