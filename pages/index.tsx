import { useState, useCallback, useEffect } from "react";
import styled, { css } from "styled-components";
import CsvDownload from "react-json-to-csv";
import csv from "csv";

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

  grid-template-columns: repeat(auto-fit, minmax(1rem, 25rem));
  grid-gap: 5rem;
  grid-template-rows: auto;
  grid-auto-flow: row;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(1rem, 20rem));
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
  box-shadow: 0px 2px 4px #3a3a3a;
  border-radius: 0.5rem;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  p {
    text-align: center;
    font-size: 1.6rem;
    font-weight: bold;
  }
`;

const Button = styled.button<{ isActive: boolean }>`
  border: 0;
  outline: 0;
  background: transparent;
  opacity: 0.5;

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

interface NatFive {
  name: string;
  dark: boolean;
  fire: boolean;
  light: boolean;
  water: boolean;
  wind: boolean;
}

export default function Home() {
  const [data, setData] = useState(natFives);

  useEffect(() => {
    const storagedData = localStorage.getItem("@SW-Nat5");

    if (storagedData) {
      setData(JSON.parse(storagedData));
    }
  }, []);

  const handleToggleActive = useCallback(
    (natData: NatFive, type: string) => {
      const newNatData = { ...natData, [type]: !natData[type] };
      const newData = data.map((nat) =>
        nat.name === newNatData.name ? newNatData : nat
      );

      setData(newData);
      localStorage.setItem("@SW-Nat5", JSON.stringify(newData));
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
        localStorage.setItem("@SW-Nat5", stringResult);
      } else {
        const csvParse = csv.parse as any;
        csvParse(String(e.target.result), (err, data) => {
          if (err) return;
          const objData = convertToArrayOfObjects(data);
          setData(objData);
          localStorage.setItem("@SW-Nat5", JSON.stringify(objData));
        });
      }
    };
  }, []);

  return (
    <Container>
      <Top>
        <DownloadButton type="button" onClick={() => handleDownloadData()}>
          Download JSON
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
      <Grid>
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
    </Container>
  );
}
