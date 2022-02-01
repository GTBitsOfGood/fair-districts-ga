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

const NewspaperAlertDialog = ({
  alertOpen,
  setAlertOpen,
  newspaperId,
  index,
  newspapers,
  setNewspapers,
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
            Delete newspaper
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
                const res = await axios.post("/api/newspaper", {
                  type: "delete",
                  id: newspaperId,
                });
                const status = await res.status;

                if (status === 200) {
                  const clonedNewspapers = [...newspapers];
                  clonedNewspapers.splice(index, 1);
                  setNewspapers(clonedNewspapers);
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

export default NewspaperAlertDialog;
