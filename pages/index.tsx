import { useState, useCallback, useEffect, useRef, ChangeEvent } from "react";
import styled, { css } from "styled-components";
import CsvDownload from "react-json-to-csv";
import csv from "csv";
import domtoimage from "dom-to-image";

import natFives from "../initialData.json";

import darkImg from "../assets/img/dark.png";
import fireImg from "../assets/img/fire.png";
import lightImg from "../assets/img/light.png";
import waterImg from "../assets/img/water.png";
import windImg from "../assets/img/wind.png";
import convertToArrayOfObjects from "../utils/convertToArrayOfObjects";

const Container: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Grid: any = styled.ul`
  width: 100%;
  display: grid;
  justify-content: center;
  padding: 5rem;
  background-color: #fff;

  grid-template-columns: repeat(auto-fit, minmax(25rem, 25rem));
  grid-gap: 5rem;
  grid-template-rows: auto;
  grid-auto-flow: row;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(25rem, 25rem));
  }
  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

Grid.Item = styled.li`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 2rem 1rem;
  background-color: #fff;
  box-shadow: 0px 2px 4px #3a3a3a;
  border-radius: 0.5rem;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  p {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }
`;

const Button = styled.button<{ isActive: boolean }>`
  border: 0;
  outline: 0;
  background: transparent;
  opacity: 0.2;

  img {
    width: 4rem;
    height: 4rem;
    object-fit: contain;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      opacity: 1;
    `}
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const DownloadButton = styled.button`
  min-width: 15rem;
  padding: 1rem 2rem;
  margin-top: 2rem;
  background-color: #3a3a3a;
  color: #fff;
  font-size: 1.6rem;
  border: 0;
  border-radius: 0.5rem;
`;

const DownloadCSVButton = styled(CsvDownload)`
  min-width: 15rem;
  padding: 1rem 2rem;
  margin-top: 2rem;
  background-color: #3a3a3a;
  color: #fff;
  font-size: 1.6rem;
  border: 0;
  border-radius: 0.5rem;
`;

const FileLabel = styled.label`
  min-width: 15rem;
  padding: 1rem 2rem;
  margin-top: 2rem;
  background-color: #3a3a3a;
  color: #fff;
  font-size: 1.6rem;
  border: 0;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;

  input {
    display: none;
  }
`;

const MainWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  > h1 {
    font-size: 32px;
    margin-top: 20px;
  }
`;

const NickLabel = styled.label`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  input {
    width: 300px;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    padding: 8px 16px;
  }
`;

interface NatFive {
  name: string;
  dark: boolean;
  fire: boolean;
  light: boolean;
  water: boolean;
  wind: boolean;
}

export default function Home() {
  const imageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState(natFives);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const storagedData = localStorage.getItem("@SW-Nat5v1");
    const storagedNick = localStorage.getItem("@SW-Nickv1");

    if (storagedNick) {
      setNickname(storagedNick);
    }
    if (storagedData) {
      setData(JSON.parse(storagedData));
    }
  }, []);

  const handleToggleActive = useCallback(
    (natData: NatFive, type: string) => {
      if (natData.name === "Anubis" && type === "light") {
        alert("Amarna = NAT 6");
      }
      if (
        (natData.name === "Sky Dancer" &&
          type !== "dark" &&
          type !== "light") ||
        (natData.name === "Harp Magician" &&
          type !== "dark" &&
          type !== "light") ||
        (natData.name === "Cannon Girl" &&
          type !== "wind" &&
          type !== "dark") ||
        (natData.name === "Vampire" && type !== "dark" && type !== "light") ||
        (natData.name === "Anubis" && type !== "dark") ||
        (natData.name === "Ninja" && type !== "dark") ||
        (natData.name === "Neost. Agent" && type !== "dark") ||
        (natData.name === "Horus" && type !== "light")
      ) {
        return;
      }
      const newNatData = { ...natData, [type]: !natData[type] };
      const newData = data.map((nat) =>
        nat.name === newNatData.name ? newNatData : nat
      );

      setData(newData);
      localStorage.setItem("@SW-Nat5v1", JSON.stringify(newData));
    },
    [data]
  );

  const handleDownloadData = useCallback(() => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "natfives" + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleLoadFile = useCallback((file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (e) => {
      if (file.type === "application/json") {
        const stringResult = String(e.target.result);
        setData(JSON.parse(stringResult));
        localStorage.setItem("@SW-Nat5v1", stringResult);
      } else {
        const csvParse = csv.parse as any;
        csvParse(String(e.target.result), (err, data) => {
          if (err) return;
          const objData = convertToArrayOfObjects(data);
          setData(objData);
          localStorage.setItem("@SW-Nat5v1", JSON.stringify(objData));
        });
      }
    };
  }, []);

  const handleDownloadImage = useCallback(async () => {
    imageRef.current.style.width = "1440px";
    imageRef.current.style.height = "720px";
    gridRef.current.style.display = "grid";

    const dataUrl = await domtoimage.toPng(imageRef.current);

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "natfives" + ".png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    imageRef.current.style.width = "100%";
    imageRef.current.style.height = "100%";
  }, []);

  const setNick = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    localStorage.setItem("@SW-Nickv1", e.target.value);
  }, []);

  return (
    <Container>
      <Top>
        <DownloadButton type="button" onClick={() => handleDownloadData()}>
          Download JSON
        </DownloadButton>
        <DownloadButton type="button" onClick={() => handleDownloadImage()}>
          Download PNG
        </DownloadButton>
        <DownloadCSVButton data={data} filename="natfives">
          Download CSV
        </DownloadCSVButton>
        <FileLabel htmlFor="import">
          Import
          <input
            id="import"
            accept=".json,.csv,.txt"
            type="file"
            onChange={(e) => handleLoadFile(e.target.files[0])}
          />
        </FileLabel>
      </Top>
      <NickLabel htmlFor="nick">
        Nickname
        <input
          id="nick"
          type="text"
          value={nickname}
          onChange={(e) => setNick(e)}
        />
      </NickLabel>
      <MainWrapper ref={imageRef}>
        <h1>{nickname}</h1>
        <Grid ref={gridRef}>
          {data.map((natData) => (
            <Grid.Item key={natData.name}>
              <div>
                <Button
                  onClick={() => handleToggleActive(natData, "dark")}
                  isActive={natData.dark}
                  type="button"
                >
                  <img src={darkImg} alt={`dark-${natData.name}`} />
                </Button>
                <Button
                  onClick={() => handleToggleActive(natData, "fire")}
                  isActive={natData.fire}
                  type="button"
                >
                  <img src={fireImg} alt={`fire-${natData.name}`} />
                </Button>
                <Button
                  onClick={() => handleToggleActive(natData, "light")}
                  isActive={natData.light}
                  type="button"
                >
                  <img src={lightImg} alt={`light-${natData.name}`} />
                </Button>
                <Button
                  onClick={() => handleToggleActive(natData, "water")}
                  isActive={natData.water}
                  type="button"
                >
                  <img src={waterImg} alt={`water-${natData.name}`} />
                </Button>
                <Button
                  onClick={() => handleToggleActive(natData, "wind")}
                  isActive={natData.wind}
                  type="button"
                >
                  <img src={windImg} alt={`wind-${natData.name}`} />
                </Button>
              </div>
              <p>{natData.name}</p>
            </Grid.Item>
          ))}
        </Grid>
      </MainWrapper>
    </Container>
  );
}
