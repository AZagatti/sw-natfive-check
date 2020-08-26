import { useState, useCallback, useEffect, useRef, ChangeEvent } from 'react';
import styled, { css } from 'styled-components';
import CsvDownload from 'react-json-to-csv';
import csv from 'csv';
import domtoimage from 'dom-to-image';
import Joi from 'joi';

import natFives from '../initialData.json';

import darkImg from '../assets/img/dark.png';
import fireImg from '../assets/img/fire.png';
import lightImg from '../assets/img/light.png';
import waterImg from '../assets/img/water.png';
import windImg from '../assets/img/wind.png';
import convertToArrayOfObjects from '../utils/convertToArrayOfObjects';
import Ad from '../components/Ad';

const mobsNames = natFives.map(item => item.name);

const Container: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Grid: any = styled.ul`
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  padding: 20px;
  background-color: var(--background-color);

  grid-template-columns: repeat(auto-fit, minmax(25rem, 25rem));
  grid-gap: 20px;
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
  background-color: var(--background-color);
  color: var(--text-color);
  box-shadow: 0px 2px 4px #000;
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
  background-color: var(--background-color);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

interface DownloadButtonProps {
  first?: boolean;
}

const DownloadButton = styled.button<DownloadButtonProps>`
  min-width: 20rem;
  padding: 1rem 2rem;
  margin-top: 5rem;
  background-color: var(--text-color);
  color: var(--background-color);
  font-size: 1.6rem;
  font-weight: bold;
  border: 0;
  border-radius: 0.5rem;

  @media (max-width: 850px) {
    font-size: 1.4rem;
    min-width: 16rem;
  }

  @media (max-width: 600px) {
    margin-top: 2rem;
    ${({ first }) =>
      first &&
      css`
        margin-top: 5rem;
      `}
  }
`;

const DownloadCSVButton = styled(CsvDownload)`
  min-width: 20rem;
  padding: 1rem 2rem;
  margin-top: 5rem;
  background-color: var(--text-color);
  color: var(--background-color);
  font-size: 1.6rem;
  font-weight: bold;
  border: 0;
  border-radius: 0.5rem;

  @media (max-width: 850px) {
    font-size: 1.4rem;
    min-width: 16rem;
  }

  @media (max-width: 600px) {
    margin-top: 2rem;
  }
`;

const FileLabel = styled.label`
  min-width: 20rem;
  padding: 1rem 2rem;
  margin-top: 5rem;
  background-color: var(--text-color);
  color: var(--background-color);
  font-size: 1.6rem;
  font-weight: bold;
  border: 0;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;

  @media (max-width: 850px) {
    font-size: 1.4rem;
    min-width: 16rem;
  }

  @media (max-width: 600px) {
    margin-top: 2rem;
  }

  input {
    display: none;
  }
`;

const MainWrapper = styled.div`
  width: 100%;
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
  align-items: center;

  > h1 {
    font-size: 32px;
    margin-top: 20px;
    color: var(--text-color);
  }

  > h2 {
    font-size: 28px;
    margin-top: 15px;
    color: var(--text-color);
  }
`;

const NickLabel = styled.label`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
  color: var(--text-color);

  input {
    width: 300px;
    border: 1px solid var(--text-color);
    background-color: var(--background-color);

    color: var(--text-color);
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 18px;
  }
`;

const Toggle = styled.label`
  position: absolute;
  top: 10px;
  left: 45%;
  display: flex;
  align-items: center;
  color: var(--text-color);
  font-size: 1.4rem;
  font-weight: bold;

  .switch {
    position: relative;
    display: inline-block;
    cursor: pointer;
    width: 5rem;
    height: 2rem;
    border-radius: 2rem;
    margin-right: 1rem;
    background-color: #3a3a3a;

    &::after {
      content: '';
      position: absolute;
      width: 1.7rem;
      height: 1.7rem;
      border-radius: 50%;
      background-color: white;
      top: 0.145rem;
      transition: all 0.3s;
      left: 0.2rem;
    }
  }

  .checkbox:checked + .switch {
    background-color: rgba(255, 200, 0);
    &::after {
      left: 3rem;
    }
  }

  .checkbox {
    display: none;
  }
`;

const Footer = styled.footer`
  width: 100%;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  h2 {
    color: var(--text-color);

    a {
      text-decoration: none;
      color: var(--text-color);
    }
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
  const [nickname, setNickname] = useState('');
  const [theme, setTheme] = useState(false);

  useEffect(() => {
    const storagedData = localStorage.getItem('@SW-Nat5v1.1');
    const storagedNick = localStorage.getItem('@SW-Nickv1.1');
    const storagedTheme = localStorage.getItem('@SW-Themev1.1');

    if (storagedTheme) {
      setTheme(true);
    }
    if (storagedNick) {
      setNickname(storagedNick);
    }
    if (storagedData) {
      setData(JSON.parse(storagedData));
    }
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty(
        '--background-color',
        '#3a3a3a',
      );
      document.documentElement.style.setProperty('--text-color', '#fff');
    } else {
      document.documentElement.style.setProperty('--background-color', '#fff');
      document.documentElement.style.setProperty('--text-color', '#3a3a3a');
    }
  }, [theme]);

  const handleToggleActive = useCallback(
    (natData: NatFive, type: string) => {
      if (natData.name === 'Anubis' && type === 'light') {
        alert('Amarna = NAT 6');
      }
      if (
        (natData.name === 'Sky Dancer' &&
          type !== 'dark' &&
          type !== 'light') ||
        (natData.name === 'Harp Magician' &&
          type !== 'dark' &&
          type !== 'light') ||
        (natData.name === 'Cannon Girl' &&
          type !== 'wind' &&
          type !== 'dark') ||
        (natData.name === 'Vampire' && type !== 'dark' && type !== 'light') ||
        (natData.name === 'Anubis' && type !== 'dark') ||
        (natData.name === 'Ninja' && type !== 'dark') ||
        (natData.name === 'Neost. Agent' && type !== 'dark') ||
        (natData.name === 'Horus' && type !== 'light')
      ) {
        return;
      }
      const newNatData = { ...natData, [type]: !natData[type] };
      const newData = data.map(nat =>
        nat.name === newNatData.name ? newNatData : nat,
      );

      setData(newData);
      localStorage.setItem('@SW-Nat5v1.1', JSON.stringify(newData));
    },
    [data],
  );

  const handleDownloadData = useCallback(() => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'natfives.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [data]);

  const handleLoadFile = useCallback((file: File) => {
    const schema = Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string()
            .valid(...mobsNames)
            .required(),
          dark: Joi.boolean().required(),
          fire: Joi.boolean().required(),
          light: Joi.boolean().required(),
          water: Joi.boolean().required(),
          wind: Joi.boolean().required(),
        }),
      )
      .required();

    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = async e => {
      if (file.type === 'application/json') {
        const stringResult = String(e.target.result);
        const jsonResult = JSON.parse(stringResult);
        try {
          await schema.validateAsync(jsonResult);
          setData(jsonResult);
          localStorage.setItem('@SW-Nat5v1.1', stringResult);
        } catch (err) {
          console.log(err.message);
        }
      } else {
        const csvParse = csv.parse as any;
        csvParse(String(e.target.result), async (err, value) => {
          if (err) {
            return;
          }
          const objData = convertToArrayOfObjects(value);

          try {
            await schema.validateAsync(objData);
            setData(objData);
            localStorage.setItem('@SW-Nat5v1.1', JSON.stringify(objData));
          } catch (error) {
            console.log(error.message);
          }
        });
      }
    };
  }, []);

  const handleDownloadImage = useCallback(async () => {
    imageRef.current.style.width = '1920px';
    gridRef.current.style.display = 'grid';

    const dataUrl = await domtoimage.toPng(imageRef.current);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'natfives.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    imageRef.current.style.width = '100%';
  }, []);

  const handleChangeTheme = useCallback(() => {
    localStorage.setItem('@SW-Themev1.1', !theme ? 'true' : '');
    setTheme(state => !state);
  }, [theme]);

  const setNick = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    localStorage.setItem('@SW-Nickv1.1', e.target.value);
  }, []);

  const natCount = data.reduce(
    (acc, mob) =>
      acc + +mob.dark + +mob.fire + +mob.water + +mob.light + +mob.wind,
    0,
  );

  return (
    <Container>
      <Top>
        <Toggle>
          <input
            id="toggle"
            type="checkbox"
            className="checkbox"
            checked={theme}
            onChange={() => handleChangeTheme()}
          />
          <label htmlFor="toggle" className="switch" />
          Change theme
        </Toggle>
        <DownloadButton
          first
          type="button"
          onClick={() => handleDownloadImage()}
        >
          Download PNG
        </DownloadButton>
        <DownloadButton type="button" onClick={() => handleDownloadData()}>
          Download JSON
        </DownloadButton>
        <DownloadCSVButton data={data} filename="natfives">
          Download CSV
        </DownloadCSVButton>
        <FileLabel htmlFor="import">
          Import JSON/CSV
          <input
            id="import"
            accept=".json,.csv,.txt"
            type="file"
            onChange={e => handleLoadFile(e.target.files[0])}
          />
        </FileLabel>
      </Top>
      <NickLabel htmlFor="nick">
        Nickname
        <input
          id="nick"
          type="text"
          value={nickname}
          onChange={e => setNick(e)}
        />
      </NickLabel>
      <MainWrapper ref={imageRef}>
        <h1>{nickname}</h1>
        <h2>{natCount} nat fives</h2>
        <Grid ref={gridRef}>
          {data.map(natData => (
            <Grid.Item key={natData.name}>
              <div>
                <Button
                  onClick={() => handleToggleActive(natData, 'water')}
                  isActive={natData.water}
                  type="button"
                >
                  <img src={waterImg} alt={`water-${natData.name}`} />
                </Button>
                <Button
                  onClick={() => handleToggleActive(natData, 'fire')}
                  isActive={natData.fire}
                  type="button"
                >
                  <img src={fireImg} alt={`fire-${natData.name}`} />
                </Button>
                <Button
                  onClick={() => handleToggleActive(natData, 'wind')}
                  isActive={natData.wind}
                  type="button"
                >
                  <img src={windImg} alt={`wind-${natData.name}`} />
                </Button>
                <Button
                  onClick={() => handleToggleActive(natData, 'light')}
                  isActive={natData.light}
                  type="button"
                >
                  <img src={lightImg} alt={`light-${natData.name}`} />
                </Button>
                <Button
                  onClick={() => handleToggleActive(natData, 'dark')}
                  isActive={natData.dark}
                  type="button"
                >
                  <img src={darkImg} alt={`dark-${natData.name}`} />
                </Button>
              </div>
              <p>{natData.name}</p>
            </Grid.Item>
          ))}
        </Grid>
        {/* <Ad /> */}
      </MainWrapper>
      <Footer>
        <h2>
          Made with{' '}
          <span role="img" aria-label="heart">
            ❤️
          </span>{' '}
          by{' '}
          <a
            href="https://www.linkedin.com/in/andre-zagatti/"
            target="_blank"
            rel="noopener noreferrer"
          >
            André Zagatti
          </a>
        </h2>
      </Footer>
    </Container>
  );
}
