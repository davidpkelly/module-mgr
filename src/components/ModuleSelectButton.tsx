import { Col, Row, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { PluggableType } from "../pages/MainPage";
import { UsbSymbol } from "react-bootstrap-icons";

import "./styles.css";
import { ChangeEvent } from "react";

function ModuleSelectButton({
  selection,
  setSelection,
}: {
  selection: PluggableType;
  setSelection: (selection: PluggableType) => void;
}) {
  const ToggleTileButton = ({
    icon,
    title,
    description,
    value,
    onChange,
    checked,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    checked: boolean;
  }) => {
    return (
      <Col xs={12} sm={6} md={5} lg={5}>
        <ToggleButton
          id={`radio-${title}`}
          type="radio"
          variant={checked ? "primary" : "outline-primary"} // Active state styling
          value={value}
          onChange={onChange}
          checked={checked}
          style={{
            maxWidth: "500px",
            height: "200px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "left",
            borderRadius: "10px",
            boxShadow: checked ? "0px 4px 12px rgba(0, 0, 0, 0.1)" : "none",
            margin: "10px",
            padding: "10px",
          }}
        >
          <div style={{ fontSize: "40px", marginRight: "15px" }}>{icon}</div>
          <div>
            <h3 style={{ marginBottom: "5px" }}>{title}</h3>
            <p style={{ fontSize: "14px" }}>{description}</p>
          </div>
        </ToggleButton>
      </Col>
    );
  };

  interface ModuleType {
    name: string;
    value: PluggableType;
  }
  const moduleTypes: ModuleType[] = [
    { name: "SFP", value: { name: "sfp" }},
    { name: "QSFP", value: { name: "qsfp" } },
  ];

  const handleSelect = (_e: ChangeEvent<HTMLInputElement>, value: PluggableType) => {
    setSelection(value);
  };

  const isSelected = (selectionName: string | undefined, value: PluggableType):boolean => {
    return selectionName === value.name as unknown as string;
  }

  return (
    <ToggleButtonGroup
      type="radio"
      name="toggleGroup"
      value={selection}
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {moduleTypes.map((mType, idx) => (
          <ToggleTileButton
            key={idx}
            icon={<UsbSymbol size={"120px"} />}
            title={mType.name}
            description={`Click here if the pluggable you want to program is a ${mType.name}.`}
            value={mType.value.name as string}
            onChange={(e) => handleSelect(e, mType.value)}
            checked={isSelected(selection?.name, mType.value)}
          />
        ))}
      </Row>
    </ToggleButtonGroup>
  );
}

export default ModuleSelectButton;
