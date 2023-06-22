import * as React from "react";
import { Text, Select } from "@chakra-ui/react";
import { type Sex, type Disease } from "./useOldStdSurveillance";
import { type Result } from "@mapbox/mapbox-gl-geocoder";

export type Mode = "side-by-side" | "split-screen";

function ControlPanel(props: {
  year: number;
  selectedPlace: Result | null;
  disease: Disease;
  setDisease: (disease: Disease) => void;
  sex: Sex;
  setSex: (sex: Sex) => void;
  setYear: (year: number) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
}) {
  const {
    year,
    setYear,
    selectedPlace,
    disease,
    setDisease,
    sex,
    setSex,
    mode,
    setMode,
  } = props;

  const layers = React.useMemo(
    () => ["6-65", "66-108", "109-150", "151-198", "199-658", "Unavailable"],
    []
  );

  const colors = React.useMemo(
    () => ["#fbf9cf", "#a4d6b2", "#37b6c6", "#257fba", "#273892", "#303030"],
    []
  );

  const onModeChange = React.useCallback(
    (evt: { target: { value: string } }) => {
      setMode(evt.target.value as Mode);
    },
    [setMode]
  );

  return (
    <div className="control-panel">
      <label>Mode: </label>
      <select value={mode} onChange={onModeChange}>
        <option value="side-by-side">Side by side</option>
        <option value="split-screen">Split screen</option>
      </select>

      {selectedPlace && <Text as="b">Region: {selectedPlace.text}</Text>}
      {!selectedPlace && <Text as="b">Region: United States</Text>}
      <Select
        size={"sm"}
        value={disease}
        onChange={(evt) => setDisease(evt.target.value as Disease)}
      >
        <option value="chlamydia">Chlamydia</option>
        <option value="gonorrhea">Gonorrhea</option>
        <option value="syphilis">Primary & Secondary Syphilis</option>
      </Select>
      <Text as="b">Filter by Sex:</Text>
      <Select
        size={"sm"}
        value={sex}
        onChange={(evt) => setSex(evt.target.value as Sex)}
      >
        <option value=""></option>
        <option value="men">Men</option>
        <option value="women">Women</option>
      </Select>
      <div key={"year"} className="input" style={{ marginTop: 10 }}>
        <label>Year: {year}</label>
        <input
          type="range"
          value={year}
          min={2017}
          max={2021}
          step={1}
          onChange={(evt) => setYear(Number(evt.target.value))}
        />
      </div>

      <div id="legend">
        Case rate*
        {layers.map((layer, i) => {
          return (
            <div key={i}>
              <span
                className="legend-key"
                style={{ backgroundColor: colors[i] }}
              ></span>
              <span>{layer}</span>
            </div>
          );
        })}
        *per 100,000
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
