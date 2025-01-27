import * as React from "react";

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";

interface Node {
    id: string;
    mfg: string;
    name: string;
    type: string;
    isCertified: boolean;
    files: number;
}

const Component = () => {
  const nodes = [] as Node[];
  const [data, setData] = React.useState({ nodes });

  const handleUpdate = (value: string | number | boolean, id: string, property: string) => {
    setData((state) => ({
      ...state,
      nodes: state.nodes.map((node: any) => {
        if (node.id === id) {
          return { ...node, [property]: value };
        } else {
          return node;
        }
      }),
    }));
  };

  return (
    <Table data={data}>
      {(tableList: any) => (
        <>
          <Header>
            <HeaderRow>
              <HeaderCell>Manufacturer</HeaderCell>
              <HeaderCell>Module Name</HeaderCell>
              <HeaderCell>Module Type</HeaderCell>
              <HeaderCell>Certified</HeaderCell>
              <HeaderCell>Bin Files</HeaderCell>
            </HeaderRow>
          </Header>

          <Body>
            {tableList.map((item: Node) => (
              <Row key={item.id} item={item}>
                <Cell>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      border: "none",
                      fontSize: "1rem",
                      padding: 0,
                      margin: 0,
                    }}
                    value={item.mfg}
                    onChange={(event) =>
                      handleUpdate(event.target.value, item.id, "mfg")
                    }
                  />
                </Cell>
                <Cell>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      border: "none",
                      fontSize: "1rem",
                      padding: 0,
                      margin: 0,
                    }}
                    value={item.name}
                    onChange={(event) =>
                      handleUpdate(event.target.value, item.id, "name")
                    }
                  />
                </Cell>
                <Cell>
                  <select
                    style={{
                      width: "100%",
                      border: "none",
                      fontSize: "1rem",
                      padding: 0,
                      margin: 0,
                    }}
                    value={item.type}
                    onChange={(event) =>
                      handleUpdate(event.target.value, item.id, "type")
                    }
                  >
                    <option value="TYPE_1">TYPE 1</option>
                    <option value="TYPE_2">TYPE 2</option>
                    <option value="TYPE_3">TYPE 3</option>
                  </select>
                </Cell>
                <Cell>
                  <input
                    type="checkbox"
                    checked={item.isCertified}
                    onChange={(event) =>
                      handleUpdate(event.target.checked, item.id, "isCertified")
                    }
                  />
                </Cell>
                <Cell>
                  <input
                    type="number"
                    style={{
                      width: "100%",
                      border: "none",
                      fontSize: "1rem",
                      padding: 0,
                      margin: 0,
                    }}
                    value={item.files}
                    onChange={(event) =>
                      handleUpdate(Number(event.target.value), item.id, "files")
                    }
                  />
                </Cell>
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
  );
};

export default Component;
