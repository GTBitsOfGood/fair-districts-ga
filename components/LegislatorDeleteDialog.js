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

const LegislatorDeleteDialog = ({
  alertOpen,
  onClose,
  legislatorIndex,
  legislators,
  setLegislators,
  
}) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={alertOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete legislator
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You cannot undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                const res = await axios.post("/api/legislator", {
                  type: "delete",
                  id: legislators[legislatorIndex].id,
                });

                if (res.status === 200) {
                  const clonedLegislators = [...legislators];
                  clonedLegislators.splice(legislatorIndex, 1);
                  setLegislators(clonedLegislators);
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

export default LegislatorDeleteDialog;
