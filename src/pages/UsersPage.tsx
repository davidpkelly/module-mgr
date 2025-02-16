import { useState, useEffect } from "react";
import { resetPassword, type ResetPasswordOutput } from "aws-amplify/auth";
import {
  Badge,
  Button,
  Container,
  Col,
  Dropdown,
  Modal,
  Row,
  SplitButton,
} from "react-bootstrap";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";
import { CheckSquare, DashSquare } from "react-bootstrap-icons";
import { Table as BTable } from "react-bootstrap";
import {
  ColumnDef,
  flexRender,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import IndeterminateCheckbox from "@/src/components/IndeterminateCheckbox";
import { useAuth } from "@/src/auth";
import ToastMessage from "@/src/components/ToastMessage";

import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

type UserType = Schema["User"]["type"];
type UserGroupType = UserType & { GroupName: string };
type User = {
  Id: string;
  Email: string;
  EmailVerified: boolean;
  FirstName: string;
  LastName: string;
  Group: "USER" | "ADMIN" | "SUPERADMIN";
  Enabled: boolean;
  Status: string;
  LastModified: string;
};

const UsersPage = () => {
  const auth = useAuth();
  const [userList, setUserList] = useState<User[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<RowSelectionState>({});
  const [showToast, setShowToast] = useState<string>("");
  const [toastType, setToastType] = useState<
    "warning" | "success" | "info" | "error" | undefined
  >("warning");
  const [showPasswordResetModal, setShowPasswordResetModal] =
    useState<boolean>(false);
  const [resetPasswordNextStep, setResetPasswordNextStep] = useState<any>();

  useEffect(() => {
    async function getUsers(): Promise<UserGroupType[]> {
      const client = generateClient<Schema>();
      const { data, errors } = await client.queries.usersList({
        authMode: "userPool",
      });
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      return Object.entries(data || []).flatMap(([group, users]) =>
        (users || []).map((user) => ({ ...user, GroupName: group }))
      );
    }

    function transformData(apiResponse: UserGroupType[]): User[] {
      //ts-ignore
      const ret: User[] =
        (apiResponse ?? []).map((resp: any): User => {
          return {
            Id:
              resp?.Attributes.find((x: { Name: string }) => x.Name === "sub")
                ?.Value ?? "",
            Email:
              resp?.Attributes.find((x: { Name: string }) => x.Name === "email")
                ?.Value || "",
            EmailVerified: !!resp?.Attributes!.find(
              (x: { Name: string }) => x.Name === "email_verified"
            )?.Value,
            FirstName:
              resp?.Attributes!.find(
                (x: { Name: string }) => x.Name === "given_name"
              )?.Value || "",
            LastName:
              resp?.Attributes!.find(
                (x: { Name: string }) => x.Name === "family_name"
              )?.Value || "",
            Group: transformGroupName(resp?.GroupName),
            Status: resp?.UserStatus!,
            Enabled: resp?.Enabled!,
            LastModified: resp?.UserLastModifiedDate!,
          };
        }) || [];
      return ret;
    }

    function transformGroupName(name: string): "USER" | "ADMIN" | "SUPERADMIN" {
      if (name === "users") return "USER";
      if (name === "admins") return "ADMIN";
      if (name === "superadmins") return "SUPERADMIN";
      console.error("Unknown group name:", name);
      return "USER";
    }

    getUsers()
      .then((userData) => {
        setUserList(transformData(userData));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error occured when fetching users:", err);
        setToastType("error");
        setShowToast("Error occured when fetching users:" + err.message);
      });
  }, []);

  const columnHelper = createColumnHelper<User>();
  const columns: ColumnDef<User, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    },
    columnHelper.accessor("Email", {
      header: "Email",
    }),
    columnHelper.accessor("EmailVerified", {
      header: "Verified",
      cell: (info) =>
        info.getValue() ? (
          <span className="table-cell-center">
            <CheckSquare color="green" />
          </span>
        ) : (
          <span className="table-cell-center">
            <DashSquare color="orange" />
          </span>
        ),
    }),
    columnHelper.accessor("FirstName", {
      header: "First Name",
    }),
    columnHelper.accessor("LastName", {
      header: "Last Name",
    }),
    columnHelper.accessor("Group", {
      header: "User Group",
    }),
    columnHelper.accessor("Enabled", {
      header: "Enabled",
      cell: (info) =>
        info.getValue() ? (
          <Badge pill bg="success">
            Enabled
          </Badge>
        ) : (
          <Badge pill bg="danger">
            Disabled
          </Badge>
        ),
    }),
    columnHelper.accessor("Status", {
      header: "Status",
    }),
    columnHelper.accessor("LastModified", {
      header: "Last Modified",
    }),
  ];

  const table = useReactTable({
    data: userList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: selectedRow,
    },
    onRowSelectionChange: setSelectedRow,
    enableRowSelection: true,
    enableMultiRowSelection: false,
  });

  interface AddNewUserEvent extends React.MouseEvent<HTMLButtonElement> {}
  const addNewUser = (e: AddNewUserEvent): void => {
    e.preventDefault();
    console.log("Add new user");
    setToastType("info");
    setShowToast("Add new user is not implemented yet.");
  };

  interface ResetUserPasswordEvent
    extends React.MouseEvent<HTMLButtonElement> {}
  const resetUserPassword = (e: ResetUserPasswordEvent): void => {
    e.preventDefault();
    const selectedUser: User[] = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    const username = selectedUser[0].Id;
    resetPassword({ username })
      .then((output: ResetPasswordOutput) => {
        const { nextStep } = output;
        if (!output.isPasswordReset) {
          setResetPasswordNextStep(nextStep);
          setShowPasswordResetModal(true);
        }
      })
      .catch((err) => {
        console.error("Error resetting password:", err);
        setToastType("error");
        setShowToast(
          `An error occurred resetting the password: ${err.message}`
        );
      });
  };

  interface DeleteUserEvent extends React.MouseEvent<HTMLButtonElement> {}
  const deleteUser = (e: DeleteUserEvent): void => {
    e.preventDefault();
    const selectedUsers: User[] = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    console.log("Delete user", selectedUsers[0].Id);
    setToastType("info");
    setShowToast("Delete user is not implemented yet.");
  };

  interface DisableUserEvent extends React.MouseEvent<HTMLButtonElement> {}
  const disableUser = (e: DisableUserEvent): void => {
    e.preventDefault();
    const selectedUsers: User[] = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    console.log("Disable user", selectedUsers[0].Id);
    setToastType("info");
    setShowToast("Disable user is not implemented yet.");
  };

  const disableDeleteUser =
    table.getSelectedRowModel().rows.length === 0 ||
    table.getSelectedRowModel().rows[0].original.Id ===
      auth.user?.payload["sub"];

  const ResetPasswordModal = (props: any) => {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props?.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE" && (
            <p>
              `A confirmation code was sent to $
              {props?.codeDeliveryDetails?.deliveryMedium}`
            </p>
          )}
          <p>`Helloworld ${props?.nextStep}`</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <ToastMessage
        show={showToast !== ""}
        onClose={() => setShowToast("")}
        message={showToast}
        type={toastType}
      />
      <Container>
        <Row className="px-4 my-5">
          <Col xs={6}>
            <h1>Users</h1>
          </Col>
          <Col></Col>
        </Row>
        <Row className="px-4 my-5 justify-content-end">
          <Col md={{ span: 2, offset: 8 }}>
            <SplitButton
              variant={"primary"}
              title={"Actions"}
              drop={"down-centered"}
            >
              <Dropdown.Item eventKey="1" onClick={addNewUser}>
                Add User
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                disabled={table.getSelectedRowModel().rows.length === 0}
                onClick={resetUserPassword}
              >
                Reset Password
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                eventKey="3"
                disabled={disableDeleteUser}
                onClick={disableUser}
              >
                Disable User
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="4"
                disabled={disableDeleteUser}
                onClick={deleteUser}
              >
                Delete User
              </Dropdown.Item>
            </SplitButton>
          </Col>
        </Row>
        <Row className="px-4 my-5">
          <Col>
            {loading ? (
              <div>Loading...</div>
            ) : (
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
            )}
          </Col>
        </Row>
      </Container>
      <ResetPasswordModal
        show={showPasswordResetModal}
        onHide={() => setShowPasswordResetModal(false)}
        resetPasswordStep={resetPasswordNextStep?.resetPasswordStep}
        codeDeliveryDetails={resetPasswordNextStep?.codeDeliveryDetails}
      />
    </>
  );
};

export default UsersPage;
