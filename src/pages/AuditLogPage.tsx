import { Container, Row, Col } from "react-bootstrap";
import ToastMessage from "../components/ToastMessage";
import { Table as BTable } from "react-bootstrap";
import {
  ColumnDef,
  flexRender,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import type { Schema } from "@/amplify/data/resource";
import { useState } from "react";

type AuditLog = Schema["AuditLog"]["type"];

const AuditLogPage = () => {
  // @ts-ignore
  const [auditLog, setAuditLog] = useState<AuditLog[] | []>([]);
  // @ts-ignore
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<RowSelectionState>({});

  const columnHelper = createColumnHelper<AuditLog>();
  const columns: ColumnDef<AuditLog, any>[] = [
    columnHelper.accessor("user", {
      header: "User",
    }),
    columnHelper.accessor("content", {
      header: "Content",
    }),
    columnHelper.accessor("datetime", {
      header: "TimeStamp",
    }),
    columnHelper.accessor("resource", {
      header: "Resource",
    }),
  ];

  const table = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: selectedRow,
    },
    onRowSelectionChange: setSelectedRow,
    enableRowSelection: true,
    enableMultiRowSelection: false,
  });

  return (
    <>
      <ToastMessage
        show={false}
        onClose={() => {}}
        message={""}
        type={"info"}
      />
      <Container>
        <Row className="px-4 my-5">
          <Col xs={6}>
            <h1>Audit Log</h1>
          </Col>
          <Col></Col>
        </Row>
        <Row className="px-4 my-5">
          <Col>
            <BTable striped bordered hover responsive size="sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id} onClick={() => row.toggleSelected()}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </BTable>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AuditLogPage;
