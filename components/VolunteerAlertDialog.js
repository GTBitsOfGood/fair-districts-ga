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

const VolunteerAlertDialog = ({
  alertOpen,
  setAlertOpen,
  volunteerId,
  index,
  volunteers,
  setVolunteers,
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
            Delete volunteer
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
                const res = await axios.post("/api/volunteer", {
                  type: "delete",
                  id: volunteerId,
                });
                const status = await res.status;

                if (status === 200) {
                  const clonedVolunteers = [...volunteers];
                  clonedVolunteers.splice(index, 1);
                  setVolunteers(clonedVolunteers);
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

export default VolunteerAlertDialog;