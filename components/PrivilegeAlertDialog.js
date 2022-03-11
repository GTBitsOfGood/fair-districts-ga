import React, { useRef } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import axios from "axios";

const PrivilegeAlertDialog = ({
  alertOpen,
  setAlertOpen,
  privilegeId,
  index,
  privileges,
  setPrivileges,
  onClose,
}) => {
  const onAlertClose = () => setAlertOpen(false);
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={alertOpen}
      leastDestructiveRef={cancelRef}
      onClose={onAlertClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Special User
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You cannot undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onAlertClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                const res = await axios.post("/api/specialUser", {
                  type: "delete",
                  id: privilegeId,
                });
                const status = res.status;

                if (status === 200) {
                  const clonedPrivileges = [...privileges];
                  clonedPrivileges.splice(index, 1);
                  setPrivileges(clonedPrivileges);
                  onAlertClose();
                  onClose();
                }
              }}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default PrivilegeAlertDialog;
